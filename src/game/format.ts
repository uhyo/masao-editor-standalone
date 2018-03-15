import { ResourceData } from '../reducer/resource';
import { MediaData } from '../reducer/media';

// metadata.editorに入れるやつ
const EDITOR_CODE = 'uhyo-masao-editor';
// 拡張情報を入れるおころ
const NAMESPACE = '_uhyo-masao-editor';

// 拡張情報のデータ
interface Augment {
  fingerprint: string | null;
  media: Record<string, MediaObject>;
}
interface MediaObject {
  key: number;
  name: string;
}

// エディタの拡張をmasao-json-formatに入れる
export function addEditorInfo(
  game: any,
  resource: ResourceData,
  media: MediaData,
): any {
  let metadata2: any = game.metadata || {};
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
    fingerprint: resource.fingerprint || null,
    media: mediaobj,
  };

  return {
    ...game,
    metadata: metadata2,
    [NAMESPACE]: augment,
  };
}

export function getAugment(game: any): Augment {
  const a = game[NAMESPACE] || {};

  if (a.fingerprint == null) {
    a.fingerprint = null;
  }
  if (a.media == null) {
    a.media = {};
  }

  return a;
}
