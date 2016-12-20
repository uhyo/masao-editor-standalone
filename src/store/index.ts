import * as React from 'react';
import {
    createStore,
    Store,
    Reducer,
} from 'redux';
import {
    connect as reduxConnect,
} from 'react-redux';

import {
    Action,
} from '../action/index';

import reducer from '../reducer/index';

// wrapper of react-redux connect()
interface Connect<S>{
    <PState, PDispatch, POwn>(mapStateToProps: (store: S)=>PState,
                mapDispatchToProps?: (dispatch: (action: Action, ownProps?: POwn)=>void)=>PDispatch,
                options?: {pure?: boolean; withRef?: boolean}): ConnectFunc<PState, PDispatch, POwn>
}

interface ConnectFunc<PState, PDispatch, POwn>{
    (component: React.ComponentClass<PState & PDispatch & POwn> | React.StatelessComponent<POwn>): React.ComponentClass<POwn>;
}

function makeConnect<S>(_reducer: Reducer<S>): Connect<S>{
    return reduxConnect;
}

export const connect = makeConnect(reducer);

export default createStore(reducer);

