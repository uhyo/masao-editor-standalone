import combineReducers from './combineReducers';

import modeReducer, {Mode} from './mode';
import testplayReducer, {TestplayData} from './testplay';
import resourceReducer, {ResourceData} from './resource';
import mediaReducer from './media';

export default combineReducers({
    mode: modeReducer,
    testplay: testplayReducer,
    resource: resourceReducer,
    media: mediaReducer,
});
