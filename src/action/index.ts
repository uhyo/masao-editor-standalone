import { ErrorActions } from './error';
import { ScreenAction } from './mode';
import { TestplayAction } from './testplay';
import { ResourceActions } from './resource';
import { MediaActions } from './media';
import { GameActions } from './game';
import { FileActions } from './file';

/**
 * Init the editor action.
 */
export interface InitAction {
  type: 'init';
}

export type Action =
  | InitAction
  | ErrorActions
  | ScreenAction
  | TestplayAction
  | ResourceActions
  | MediaActions
  | GameActions
  | FileActions;
