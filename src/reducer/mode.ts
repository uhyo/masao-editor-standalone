import {
    Action,
} from '../action';

export type Mode = 'main' | 'testplay' | 'resource';

export default function modeReducer(state: Mode = 'main', action: Action): Mode{
    if (action.type === 'main-screen'){
        return 'main';
    }else if (action.type === 'testplay'){
        return 'testplay';
    }else if (action.type === 'resource-screen'){
        return 'resource';
    }
    return state;
}
