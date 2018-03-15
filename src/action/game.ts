import { MasaoJSONFormat } from '../game/format';

// logicの前
export interface LoadGameAction {
  type: 'load-game';
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
