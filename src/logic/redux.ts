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
interface LogicDefinitionBase<S, A extends Action>{
    cancelType?: '*' | SingleTypeName | Array<SingleTypeName>;
    debounce?: number;
    throttle?: number;
    latest?: boolean;
    
    validate?(obj: {
        getState: GetStateFunc<S>;
        action: A;
    }, allow: (action?: A)=>void, reject: (action?: A)=>void): void;
    transform?(obj: {
        getState: GetStateFunc<S>;
        action: A;
    }, allow: (action?: A)=>void, reject: (action?: A)=>void): void;

    processOptions?: {
        dispatchReturn?: boolean;
        dispatchMultiple?: boolean;
        successType?: Action['type'] | ((payload: any)=>Action);
        failType?: Action['type'] | ((payload: any)=>Action);
    };

    process?(obj: {
        getState: GetStateFunc<S>;
        action: A;
        cancelled$: any;
    }): Action | Promise<Action>;
    process?(obj: {
        getState: GetStateFunc<S>;
        action: A;
        cancelled$: any;
    }, dispatch: (action: Action)=>void, done?: ()=>void): void;

}
interface LogicDefinition<S> extends LogicDefinitionBase<S, Action>{
    type: '*' | SingleTypeName | Array<SingleTypeName>;
}
interface SingleLogicDefinition<S, A extends Action> extends LogicDefinitionBase<S, A>{
    type: A['type'];
}

function makeCreateLogic<S>(_reducer: Reducer<S>): CreateLogic<S>{
    return reduxLogic.createLogic;
}

export const createLogic = makeCreateLogic(reducer);
