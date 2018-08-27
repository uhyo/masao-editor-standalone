// 編集中のゲームの情報だ
import { MasaoJSONFormat } from '../game/format';
import randomString from '../util/random-string';
import { Action } from '../action';
import { SavedType } from '../action/game';

import { GameMetadata } from '../game/metadata';
import { defaultGame } from '../util/default-game';

export interface GameData {
  /**
   * Whether game is loaded.
   */
  loaded: boolean;
  /**
   * Id of this game.
   */
  id: string;
  /**
   * Metadata of game.
   */
  metadata: GameMetadata;
  /**
   * Saving status of current game.
   */
  saving: SavedType;
  /**
   * Current game.
   */
  game: MasaoJSONFormat;
}

const initialData: GameData = {
  loaded: false,
  id: randomString(),
  metadata: {},
  saving: 'no',
  game: defaultGame,
};

export default function gameReducer(
  state = initialData,
  action: Action,
): GameData {
  if (action.type === 'got-game') {
    console.assert(action.id != null, 'action.id should not be undefined');
    return {
      ...state,
      loaded: true,
      id: action.id,
      metadata: action.metadata,
      game: action.game,
    };
  } else if (action.type === 'game-update-saving') {
    return {
      ...state,
      saving: action.saving,
    };
  }
  return state;
}
