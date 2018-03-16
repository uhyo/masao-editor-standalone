import { createLogic } from './redux';
import {
  BrowserFile,
  LoadFilesAction,
  SaveInBrowserAction,
  LoadLastAction,
} from '../action/file';

import randomString from '../util/random-string';

import {
  DATABASE_NAME,
  OS_FILE,
  IDX_FILE_LASTMODIFIED,
  LAST_ID_KEY,
  openDatabase,
} from './db';

/**
 * ファイルをDBからロードするロジック
 */
const loadFileLogic = createLogic<LoadFilesAction>({
  type: 'request-load-files',
  process({}, dispatch, done) {
    dispatch({
      type: 'file-load-started',
    });
    // 結果の配列
    const files: BrowserFile[] = [];

    openDatabase()
      .then(db => {
        return new Promise((resolve, reject) => {
          const tx = db.transaction(OS_FILE, 'readonly');
          const store = tx.objectStore(OS_FILE);
          const idx = store.index(IDX_FILE_LASTMODIFIED);

          // 全てのファイルを取得（新しい順に）
          const req = idx.openCursor(undefined, 'prev');
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor != null) {
              files.push(cursor.value);
              cursor.continue();
            } else {
              // 終了
              dispatch({
                type: 'got-files',
                files,
              });
              resolve();
            }
          };
          req.onerror = reject;
        });
      })
      .catch(er => {
        dispatch({
          type: 'error',
          message: String(er),
        });
      })
      .then(done);
  },
});

/**
 * ファイルをブラウザにセーブするロジック
 */
const saveInBrowserLogic = createLogic<SaveInBrowserAction>({
  type: 'file-save-in-browser',
  process({ action: { id, game }, getState }, dispatch, done) {
    openDatabase()
      .then(
        db =>
          new Promise((resolve, reject) => {
            const tx = db.transaction(OS_FILE, 'readwrite');
            const store = tx.objectStore(OS_FILE);

            const file: BrowserFile = {
              id,
              lastModified: new Date(),
              data: game,
            };
            // update or insert
            const res = store.put(file);
            res.onsuccess = () => {
              // これが最新なのでlocalStorageにIDを保存
              localStorage.setItem(LAST_ID_KEY, id);
              resolve();
              const { file: { status } } = getState();
              if (status === 'loading') {
                // 再ロードする
                dispatch({
                  type: 'request-load-files',
                });
              }
            };
            res.onerror = reject;
          }),
      )
      .catch(er => {
        dispatch({
          type: 'error',
          message: String(er),
        });
      })
      .then(done);
  },
});

/**
 * 前回開いていたファイルを読み込むロジック
 */
const loadLastLogic = createLogic<LoadLastAction>({
  type: 'file-load-last',
  process({ getState }, dispatch, done) {
    // localStorageから読む
    const lastid = localStorage.getItem(LAST_ID_KEY);

    if (!lastid) {
      // ないよ
      const { id, game } = getState().game;
      dispatch({
        type: 'got-game',
        id,
        game,
      });
      return;
    }

    openDatabase()
      .then(
        db =>
          new Promise((resolve, reject) => {
            const tx = db.transaction(OS_FILE, 'readonly');
            const store = tx.objectStore(OS_FILE);

            const req = store.get(lastid);
            req.onsuccess = () => {
              const doc: BrowserFile | undefined = req.result;

              if (doc == null) {
                // そんなものはない
                const { id, game } = getState().game;
                dispatch({
                  type: 'got-game',
                  id,
                  game,
                });
                return;
              }
              // ゲームを読み込んだ
              const { id, data: game } = doc;
              dispatch({
                type: 'got-game',
                id,
                game,
              });
              resolve();
            };
            req.onerror = reject;
          }),
      )
      .catch(er => {
        dispatch({
          type: 'error',
          message: String(er),
        });
      })
      .then(done);
  },
});

// export all logics.
export default [loadFileLogic, saveInBrowserLogic];
