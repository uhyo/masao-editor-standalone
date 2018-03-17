import * as React from 'react';
import { createStore, Store, Reducer, applyMiddleware } from 'redux';
import { connect as reduxConnect } from 'react-redux';

const reduxLogic: any = require('redux-logic');

import { Action } from '../action/index';

import reducer from '../reducer/index';

import logics from '../logic/index';

// wrapper of react-redux connect()
interface Connect<S> {
  <PState, PDispatch, POwn>(
    mapStateToProps: (store: S, ownProps?: POwn) => PState,
    mapDispatchToProps?: (
      dispatch: (action: Action) => void,
      ownProps?: POwn,
    ) => PDispatch,
    options?: { pure?: boolean; withRef?: boolean },
  ): ConnectFunc<PState & PDispatch, POwn>;
}

interface ConnectFunc<PAdd, POwnMin> {
  <PAll extends PAdd & POwnMin>(
    component: React.ComponentType<PAll>,
  ): React.ComponentClass<Pick<PAll, Exclude<keyof PAll, keyof PAdd>>>;
}

function makeConnect<S>(_reducer: Reducer<S>): Connect<S> {
  return reduxConnect;
}

export const connect = makeConnect(reducer);

// redux-logic
const logicMiddleware = reduxLogic.createLogicMiddleware(logics);

export default createStore(reducer, applyMiddleware(logicMiddleware));
