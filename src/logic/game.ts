import { createLogic } from './redux';
import { GotGameAction } from '../action/game';
import randomString from '../util/random-string';
import { getAugment } from '../game/format';

import { LAST_ID_KEY } from './db';
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

export default [getGameId];
