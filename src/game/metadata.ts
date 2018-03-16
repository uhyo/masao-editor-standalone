import { MasaoJSONFormat } from './format';

/**
 * ゲームのデータからゲームのタイトルを取得
 */
export function getGameTitle(game: MasaoJSONFormat): string {
  return (game.metadata && game.metadata.title) || '無題';
}
