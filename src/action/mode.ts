// メイン画面
export interface MainScreenAction {
  type: 'main-screen';
}

// リソース管理画面
export interface ResourceScreenAction {
  type: 'resource-screen';
}

// キーバインド画面
export interface KeyScreenAction {
  type: 'key-screen';
}

export type ScreenAction =
  | MainScreenAction
  | ResourceScreenAction
  | KeyScreenAction;
