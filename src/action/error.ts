// エラー
export interface ErrorAction {
  type: 'error';
  message: string;
}

export interface ClearErrorAction {
  type: 'clear-error';
}

export type ErrorActions = ErrorAction | ClearErrorAction;
