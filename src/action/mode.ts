/**
 * メイン画面を表示するアクション
 */
export interface MainScreenAction {
  type: 'main-screen';
}

/**
 * リソース管理画面を表示するアクション
 */
export interface ResourceScreenAction {
  type: 'resource-screen';
}

/**
 * ファイル管理画面を表示するアクション
 */
export interface FileScreenAction {
  type: 'file-screen';
}

/**
 * キーバインド画面を表示するアクション
 */
export interface KeyScreenAction {
  type: 'key-screen';
}

export type ScreenAction =
  | MainScreenAction
  | ResourceScreenAction
  | FileScreenAction
  | KeyScreenAction;
