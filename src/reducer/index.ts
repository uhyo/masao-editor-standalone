import {
    combineReducers,
} from 'redux';

import modeReducer from './mode';

export default combineReducers({
    mode: modeReducer,
});
