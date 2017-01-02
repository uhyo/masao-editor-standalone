import {
    ErrorActions,
} from './error';
import {
    MainScreenAction,
    ResourceScreenAction,
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
    MainScreenAction | ResourceScreenAction |
    TestplayAction |
    ResourceActions |
    MediaActions |
    GameActions;
