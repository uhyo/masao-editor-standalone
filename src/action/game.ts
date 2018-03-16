import { MasaoJSONFormat } from '../game/format';

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
}

// logicの後
export interface GotGameAction {
  type: 'got-game';
  /**
   * 読みこまれたゲームのID
   */
  id: string;
  /**
   * ゲーム本体
   */
  game: MasaoJSONFormat;
}

export type GameActions = LoadGameAction | GotGameAction;
