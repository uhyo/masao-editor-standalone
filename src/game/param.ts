import { param } from 'masao';
import { MediaData } from '../reducer/media';

const defaults: Record<string, string> = {
  filename_chizu: 'chizu.gif',
  filename_ending: 'ending.gif',
  filename_gameover: 'gameover.gif',
  filename_haikei: 'haikei.gif',
  filename_haikei2: 'haikei.gif',
  filename_haikei3: 'haikei.gif',
  filename_haikei4: 'haikei.gif',
  filename_mapchip: 'mapchip.gif',
  filename_pattern: 'pattern.gif',
  filename_title: 'title.gif',
};

export function addResource(
  mode: 'testplay' | 'save',
  params: Record<string, string>,
  media: MediaData,
): Record<string, string> {
  // リソースのデータを作る
  const adds: Record<string, string> = {};

  for (let key of param.resourceKeys) {
    const d = media.data[key];
    if (d == null) {
      adds[key] = defaults[key] || '';
    } else {
      if (mode === 'testplay') {
        adds[key] = d.url || defaults[key] || '';
      } else {
        adds[key] = d.name || defaults[key] || '';
      }
    }
  }
  return {
    ...params,
    ...adds,
  };
}
