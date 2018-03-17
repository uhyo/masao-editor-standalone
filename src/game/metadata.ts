import { MasaoJSONFormat } from './format';

/**
 * ゲームのデータからゲームのタイトルを取得
 */
export function getGameTitle(game: MasaoJSONFormat): string {
  return (game.metadata && game.metadata.title) || '無題';
}

/**
 * メタデータを書き込む
 */
export function writeMetadata(
  game: MasaoJSONFormat,
  data: Partial<MasaoJSONFormat['metadata']>,
): void {
  if (game.metadata == null) {
    game.metadata = {};
  }
  Object.assign(game.metadata, data);
}
