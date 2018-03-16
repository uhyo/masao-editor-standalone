import { createLogic } from './redux';

import { InitAction } from '../action';

/**
 * エディタを初期化するロジック
 */
const initLogic = createLogic<InitAction>({
  type: 'init',
  process({}, dispatch, done) {
    // まずフィンガープリントを読む
    dispatch({
      type: 'load-fingerprint',
    });
    // そして前回開いていたファイルを再度開く
    dispatch({
      type: 'file-load-last',
    });
    done();
  },
});

export default [initLogic];
