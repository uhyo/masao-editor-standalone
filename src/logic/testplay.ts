// testplay logic
import { createLogic } from './redux';
import { TestplayAction } from '../action/testplay';

import * as masao from 'masao';

const testplayLogic = createLogic<TestplayAction>({
  type: 'testplay',
  transform({ action }, allow, reject) {
    // invalidなやつを除くぞ
    try {
      const game = masao.format.load(action.game);
      allow({
        ...action,
        game,
      });
    } catch (e) {
      console.error(e);
      reject({
        type: 'error',
        message: String(e),
      });
    }
  },
});

export default [testplayLogic];
