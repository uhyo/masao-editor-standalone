// wrapper of redux's combineReducers
import {
    combineReducers as reduxCombineReducers,
} from 'redux';

import {
    Action,
} from '../action/index';

interface Reducer<S>{
    (state: S, action: Action): S;
}

interface CombineReducersFunction{
    <D>(reducers: {[K in keyof D]: Reducer<D[K]>}): Reducer<D>;
}

const combineReducers: CombineReducersFunction = reduxCombineReducers;

export default combineReducers;
