import combineReducers from './combineReducers';

import modeReducer from './mode';
import testplayReducer from './testplay';

export default combineReducers({
    mode: modeReducer,
    testplay: testplayReducer,
});
