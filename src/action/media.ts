// media action

// 指定したparamに対する
export interface SetMediaAction {
  type: 'set-media';
  // このparamに対する
  param: string;
  // リソース番号
  key: number;
  // リソース名
  name: string;
  // ObjectURLを発行
  url?: string;
}
export interface UnsetMediaAction {
  type: 'unset-media';
  param: string;
}

// mediaをリセット
export interface ResetMediaAction {
  type: 'reset-media';
}

export type MediaActions = SetMediaAction | UnsetMediaAction | ResetMediaAction;
