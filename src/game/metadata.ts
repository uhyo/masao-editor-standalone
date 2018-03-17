import { MasaoJSONFormat } from './format';

export type GameMetadata = MasaoJSONFormat['metadata'];

/**
 * ゲームのデータからゲームのタイトルを取得
 */
export function getGameTitle(game: MasaoJSONFormat): string {
  return (game.metadata && game.metadata.title) || '無題';
}

/**
 * メタデータをゲームから抜き出す
 */
export function extractMetadata(game: MasaoJSONFormat): GameMetadata {
  const metadata = game.metadata || {};
  const result = {
    title: metadata.title,
    author: metadata.author,
    editor: metadata.editor,
  };
  return result;
}

/**
 * メタデータを書き込む
 */
export function writeMetadata(
  game: MasaoJSONFormat,
  data: Partial<GameMetadata>,
): void {
  if (game.metadata == null) {
    game.metadata = {};
  }
  Object.assign(game.metadata, data);
}
