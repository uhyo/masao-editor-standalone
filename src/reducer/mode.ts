import {
    Action,
} from '../action';

export type Mode = 'main' | 'testplay';

export default function modeReducer(state: Mode, action: Action): Mode{
    if (action.type === 'testplay'){
        return 'testplay';
    }
    return state || 'main';
}
