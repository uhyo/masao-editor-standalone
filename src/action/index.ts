import {
    ErrorActions,
} from './error';
import {
    ScreenAction,
} from './mode';
import {
    TestplayAction,
} from './testplay';
import {
    ResourceActions,
} from './resource';
import {
    MediaActions,
} from './media';
import {
    GameActions,
} from './game';



export type Action =
    ErrorActions |
    ScreenAction |
    TestplayAction |
    ResourceActions |
    MediaActions |
    GameActions;
