import {
    Action,
} from '../action';

export type State = 'main' | 'testplay';

export default function modeReducer(state: State, action: Action): State{
    if (action.type === 'testplay'){
        return 'testplay';
    }
    return state || 'main';
}
