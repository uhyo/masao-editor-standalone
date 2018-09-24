import { Action } from '../action';

export type Mode = 'main' | 'testplay' | 'file' | 'resource' | 'key' | 'about';

export default function modeReducer(
  state: Mode = 'main',
  action: Action,
): Mode {
  if (action.type === 'main-screen') {
    return 'main';
  } else if (action.type === 'testplay') {
    return 'testplay';
  } else if (action.type === 'resource-screen') {
    return 'resource';
  } else if (action.type === 'file-screen') {
    return 'file';
  } else if (action.type === 'key-screen') {
    return 'key';
  } else if (action.type === 'about-screen') {
    return 'about';
  }
  return state;
}
