// wrapper of redux's combineReducers
import { combineReducers as reduxCombineReducers } from 'redux';

import { Action } from '../action/index';

interface Reducer<S> {
  (state: S | undefined, action: Action): S;
}

interface CombineReducersFunction {
  <D>(reducers: { [K in keyof D]: Reducer<D[K] | undefined> }): Reducer<D>;
}

const combineReducers: CombineReducersFunction = reduxCombineReducers;

export default combineReducers;
