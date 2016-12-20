import combineReducers from './combineReducers';

import modeReducer from './mode';

export default combineReducers({
    mode: modeReducer,
});
