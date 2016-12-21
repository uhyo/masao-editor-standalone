// testplay logic
import {
    createLogic,
} from './redux';

export default createLogic({
    type: 'testplay',
    validate({action}, allow){
        console.log('testplay logic!', action);
        allow(action);
    }
});
