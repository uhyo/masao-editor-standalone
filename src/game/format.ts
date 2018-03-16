import { format } from 'masao';
import { ResourceData } from '../reducer/resource';
import { MediaData } from '../reducer/media';

// metadata.editorに入れるやつ
const EDITOR_CODE = 'uhyo-masao-editor';
// 拡張情報を入れるおころ
const NAMESPACE = '_uhyo-masao-editor';

/**
 * 拡張情報のデータ
 */
export interface Augment {
  /**
   * 拡張情報のバージョン
   */
  version: number;
  /**
   * ゲームを作成したブラウザの識別子
   */
  fingerprint: string | null;
  /**
   * このゲームが使用するメディア
   */
  media: Record<string, MediaObject>;
  /**
   * ゲームにつけられたID
   */
  id: string | undefined;
}
export interface MediaObject {
  key: number;
  name: string;
}

/**
 * masao-json-formatデータ（エディタ独自拡張つき）
 */
export type MasaoJSONFormat = format.MasaoJSONFormat & EditorExtension;

export interface EditorExtension {
  [NAMESPACE]?: Augment;
}

export interface AdditionData {
  /**
   * ゲームのID
   */
  id: string;
  /**
   * リソースの情報
   */
  resource: ResourceData;
  /**
   * メディアの情報
   */
  media: MediaData;
}
/**
 * エディタの拡張をmasao-json-formatに追加する
 */
export function addEditorInfo(
  game: MasaoJSONFormat,
  { id, resource, media }: AdditionData,
): MasaoJSONFormat {
  let metadata2 = game.metadata || {};
  if (metadata2.editor == null) {
    metadata2.editor = EDITOR_CODE;
  }

  // 拡張
  const mediaobj: Record<string, MediaObject> = {};
  for (let param in media.data) {
    const obj = media.data[param];
    if (obj != null) {
      mediaobj[param] = {
        key: obj.key,
        name: obj.name,
      };
    }
  }

  const augment: Augment = {
    version: 1,
    fingerprint: resource.fingerprint || null,
    media: mediaobj,
    id,
  };

  return {
    ...game,
    metadata: metadata2,
    [NAMESPACE]: augment,
  };
}

export function getAugment(game: MasaoJSONFormat): Augment {
  const a: any = game[NAMESPACE] || {};

  if (a.fingerprint == null) {
    a.fingerprint = null;
  }
  if (a.media == null) {
    a.media = {};
  }

  return a;
}
