import {
    Reducer,
} from 'redux';
import {
    Action
} from '../action/index';
import reducer from '../reducer/index';

const reduxLogic: any = require('redux-logic');

// wraps react-redux's createLogic
interface CreateLogic<S>{
    <A extends Action>(def: SingleLogicDefinition<S, A>): any;
    (def: LogicDefinition<S>): any;
}
type SingleTypeName = Action['type'] | RegExp;
type GetStateFunc<S> = ()=>S;
type ProcessFunc<S, A extends Action> = ((obj: {
        getState: GetStateFunc<S>;
        action: A;
        cancelled$: any;
    }, dispath: (action: Action)=>void, done: ()=>void)=> void) |
    ((obj: {
        getState: GetStateFunc<S>;
        action: A;
        cancelled$: any;
    })=> Action | Promise<Action>);
interface LogicDefinitionBase<S, A extends Action>{
    cancelType?: '*' | SingleTypeName | Array<SingleTypeName>;
    debounce?: number;
    throttle?: number;
    latest?: boolean;
    
    validate?(obj: {
        getState: GetStateFunc<S>;
        action: A;
    }, allow: (action?: Action)=>void, reject: (action?: Action)=>void): void;
    transform?(obj: {
        getState: GetStateFunc<S>;
        action: A;
    }, allow: (action?: Action)=>void, reject: (action?: Action)=>void): void;

    processOptions?: {
        dispatchReturn?: boolean;
        dispatchMultiple?: boolean;
        successType?: Action['type'] | ((payload: any)=>Action);
        failType?: Action['type'] | ((payload: any)=>Action);
    };

    /*
    process?(obj: {
        getState: GetStateFunc<S>;
        action: A;
        cancelled$: any;
    }): Action | Promise<Action>;
    */
    process?: ProcessFunc<S, A>;
}
interface LogicDefinition<S> extends LogicDefinitionBase<S, Action>{
    type: '*' | SingleTypeName | Array<SingleTypeName>;
}
/*
interface SingleLogicDefinition<S, A extends Action> extends LogicDefinitionBase<S, A>{
    type: A['type'];
}
*/
type SingleLogicDefinition<S, A extends Action> = LogicDefinitionBase<S, A> & {
    type: A['type'];
};

function makeCreateLogic<S>(_reducer: Reducer<S>): CreateLogic<S>{
    return reduxLogic.createLogic;
}

export const createLogic = makeCreateLogic(reducer);
