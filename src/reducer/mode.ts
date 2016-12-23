import {
    Action,
} from '../action';

export type Mode = 'main' | 'testplay';

export default function modeReducer(state: Mode, action: Action): Mode{
    if (action.type === 'testplay'){
        return 'testplay';
    }else if (action.type === 'end-testplay'){
        return 'main';
    }
    return state || 'main';
}
