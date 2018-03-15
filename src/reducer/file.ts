import { Action } from '../action';
import { format } from 'masao';
import { BrowserFile } from '../action/file';

/**
 * ブラウザに保存されているゲームの状態
 */
export interface FileData {
  /**
   * ロード状態
   */
  status: 'none' | 'loading' | 'loaded';
  /**
   * 読みこまれたファイル達
   */
  files: Array<BrowserFile>;
}

const initialData: FileData = {
  status: 'none',
  files: [],
};

/**
 * File reducer.
 */
export default function(state = initialData, action: Action): FileData {
  if (action.type === 'file-load-started') {
    return {
      ...state,
      status: 'loading',
    };
  } else if (action.type === 'got-files') {
    return {
      status: 'loaded',
      files: action.files,
    };
  }
  return state;
}
