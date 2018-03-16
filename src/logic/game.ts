import { createLogic } from './redux';
import { GotGameAction } from '../action/game';
import randomString from '../util/random-string';
import { getAugment } from '../game/format';

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
      game,
    });
  },
});

export default [getGameId];
