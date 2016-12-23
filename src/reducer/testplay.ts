import {
    Action,
} from '../action';

export interface TestplayData{
    startStage: number;
    // masao-json-format
    game: any;
}
// testplay data
const initialData: TestplayData = {
    startStage: 1,
    game: null,
}
export default function testplayReducer(state = initialData, action: Action): TestplayData{
    if (action.type === 'testplay'){
        return {
            startStage: action.startStage,
            game: action.game,
        };
    }else{
        return state;
    }
}
