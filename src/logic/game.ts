import { createLogic } from './redux';
import { LoadGameAction, GotGameAction } from '../action/game';
import { Resource } from '../action/resource';
import randomString from '../util/random-string';
import { getAugment } from '../game/format';
import { getGameTitleFromMetadata, extractMetadata } from '../game/metadata';

import { OS_RESOURCE, LAST_ID_KEY, openDatabase } from './db';

/**
 * ゲームがロードされたときのロジック
 */
const loadGameLogic = createLogic<LoadGameAction>({
  type: 'load-game',
  validate({ action, getState }, allow, reject) {
    const { game: { metadata, saving } } = getState();
    if (saving === 'updated') {
      const title = getGameTitleFromMetadata(metadata);
      const res = confirm(
        `「${title}」は保存されていません。別のステージを開いてよろしいですか？`,
      );
      if (res) {
        allow(action);
      } else {
        reject();
      }
    } else {
      allow(action);
    }
  },
  process({ action, getState }, dispatch, done) {
    const { game } = action;
    const { file, resource, media } = getState();

    const augment = getAugment(game);
    const metadata = extractMetadata(game);

    // 開くファイルが変わったのでメディアを初期化
    dispatch({
      type: 'reset-media',
    });

    // 新しいファイルが開かれるので保存状態を初期化
    dispatch({
      type: 'game-update-saving',
      saving: action.new ? 'no' : 'saved',
    });

    // メディアまわりの処理をするPromise
    let p;
    if (augment.fingerprint === resource.fingerprint) {
      // このファイルはこのブラウザで保存されているからメディア情報が利用可能かも
      p = openDatabase()
        .then(
          db =>
            new Promise((resolve, reject) => {
              const tx = db.transaction(OS_RESOURCE, 'readonly');
              const store = tx.objectStore(OS_RESOURCE);

              // 指定されたメディア
              const mds = Object.keys(augment.media);
              const one: (i: number) => void = (i: number) => {
                const param = mds[i];
                if (param == null) {
                  resolve();
                  return;
                }
                const mob = augment.media[param];
                if (mob == null) {
                  return one(i + 1);
                }
                const { key } = mob;
                // keyで指定されたresourceを読み込む
                const req = store.get(key);
                req.onerror = reject;
                req.onsuccess = () => {
                  const obj: Resource = req.result;
                  if (obj == null) {
                    return one(i + 1);
                  }
                  // メディアあった
                  const { filename: name, blob } = obj;
                  dispatch({
                    type: 'set-media',
                    param,
                    key,
                    name,
                    url: URL.createObjectURL(blob),
                  });
                  return one(i + 1);
                };
              };
              one(0);
            }),
        )
        .then(() => {
          dispatch({
            type: 'got-game',
            // IDは存在しない場合のみ新規生成
            id: augment.id || randomString(),
            metadata,
            game,
          });
        });
    } else {
      // リソースは一切なし
      dispatch({
        type: 'got-game',
        id: randomString(),
        metadata,
        game,
      });
      p = Promise.resolve();
    }
    p
      .then(() => {
        if (action.gotoMain) {
          // main画面に移動
          dispatch({
            type: 'main-screen',
          });
        }
      })
      .catch(er => dispatch({ type: 'error', message: String(er) }))
      .then(done);
  },
});

/**
 * ゲームからIDを抽出するロジック
 */
const getGameId = createLogic<GotGameAction>({
  type: 'got-game',
  transform({ action: { game }, getState }, next) {
    const { resource: { fingerprint } } = getState();
    const aug = getAugment(game);
    // gameにidが書いてあるか?
    let id;
    if (!fingerprint || fingerprint !== aug.fingerprint || !aug.id) {
      // 書いていないので新しいIDを発行
      id = randomString();
    } else {
      // 採用
      id = aug.id;
    }
    next({
      type: 'got-game',
      id,
      metadata: game.metadata,
      game,
    });
  },
  process({ action: { id } }, _, next) {
    // 現在開いていいるファイルを更新
    if (id != null) {
      localStorage.setItem(LAST_ID_KEY, id);
    }
    next();
  },
});

export default [loadGameLogic, getGameId];
