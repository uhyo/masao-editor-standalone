import { MasaoJSONFormat } from '../game/format';
import { GameMetadata } from '../game/metadata';

/**
 * Saving status of current game.
 */
export type SavedType = 'no' | 'saved' | 'updated';

/**
 * このゲームを開いて読み込む
 */
export interface LoadGameAction {
  type: 'load-game';
  /**
   * ゲームのID
   */
  id: string | undefined;
  /**
   * 読みこまれたゲーム
   */
  game: MasaoJSONFormat;
  /**
   * このゲームが新規かどうかのフラグ
   */
  new: boolean;
}

// logicの後
export interface GotGameAction {
  type: 'got-game';
  /**
   * 読みこまれたゲームのID
   */
  id: string;
  /**
   * メタデータ
   */
  metadata: GameMetadata;
  /**
   * ゲーム本体
   */
  game: MasaoJSONFormat;
}

/**
 * ゲームの保存状態を更新
 */
export interface UpdateSavingAction {
  type: 'game-update-saving';
  saving: SavedType;
}

export type GameActions = LoadGameAction | GotGameAction | UpdateSavingAction;
