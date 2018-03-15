import combineReducers from './combineReducers';

import errorReducer from './error';
import modeReducer, { Mode } from './mode';
import testplayReducer, { TestplayData } from './testplay';
import resourceReducer, { ResourceData } from './resource';
import mediaReducer from './media';
import gameReducer from './game';

export default combineReducers({
  error: errorReducer,
  mode: modeReducer,
  testplay: testplayReducer,
  resource: resourceReducer,
  media: mediaReducer,
  game: gameReducer,
});
