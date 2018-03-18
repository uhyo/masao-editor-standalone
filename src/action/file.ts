// ファイル管理関連のアクション
import { MasaoJSONFormat } from '../game/format';

/**
 * ブラウザに保存されているひとつのファイル
 */
export interface BrowserFile {
  /**
   * このファイルに付けられたID
   */
  id: string;
  /**
   * 最終更新日時
   */
  lastModified: Date;
  /**
   * ゲームの本体
   */
  data: MasaoJSONFormat;
}

/**
 * ファイルデータのロードを要求する
 */
export interface LoadFilesAction {
  type: 'request-load-files';
}

/**
 * ファイルをブラウザに保存するアクション
 */
export interface SaveInBrowserAction {
  type: 'file-save-in-browser';
  /**
   * ファイルのID
   */
  id: string;
  /**
   * ゲームデータ
   */
  game: MasaoJSONFormat;
}

/**
 * 前回開いていたファイルを読み込むアクション
 */
export interface LoadLastAction {
  type: 'file-load-last';
}

/**
 * ファイルを削除するアクション
 */
export interface DeleteFileAction {
  type: 'file-delete';
  file: BrowserFile;
}

/**
 * 編集中のファイルを変更するアクション
 */
export interface SetEditingAction {
  type: 'file-set-editing';
  id: string | undefined;
}

/**
 * 現在の状態をバックアップするアクション
 */
export interface BackupAction {
  type: 'file-backup';
  game: MasaoJSONFormat | undefined;
}

// ----- logicの後 -----

/**
 * ロード中状態に変化した
 */
export interface LoadStartedAction {
  type: 'file-load-started';
}
/**
 * ファイルがロードされた
 */
export interface GotFilesAction {
  type: 'got-files';
  files: Array<BrowserFile>;
}

export type FileActions =
  | LoadFilesAction
  | SaveInBrowserAction
  | LoadLastAction
  | DeleteFileAction
  | SetEditingAction
  | BackupAction
  | LoadStartedAction
  | GotFilesAction;
