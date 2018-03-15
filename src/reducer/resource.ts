import { Action } from '../action';
import { Resource, SetResourceSizeAction } from '../action/resource';

export { Resource };

export interface ResourceData {
  // ブラウザに与えられたID
  fingerprint: string | undefined;
  // ロード中か
  status: 'none' | 'loading' | 'loaded';
  // 表示サイズ
  size: SetResourceSizeAction['size'];
  // 読んだリソース
  resources: Array<Resource>;
}

const initialData: ResourceData = {
  fingerprint: undefined,
  status: 'none',
  size: 'middle',
  resources: [],
};

export default function(state = initialData, action: Action): ResourceData {
  if (action.type === 'set-resource-size') {
    return {
      ...state,
      size: action.size,
    };
  }
  if (action.type === 'load-fingerprint') {
    return {
      ...state,
      fingerprint: action.fingerprint,
    };
  }
  if (action.type === 'resources-load-started') {
    return {
      ...state,
      status: 'loading',
    };
  }
  if (action.type === 'got-resources') {
    return {
      ...state,
      status: 'loaded',
      resources: [...action.resources],
    };
  }
  if (action.type === 'new-resources') {
    if (state.status === 'loaded') {
      return {
        ...state,
        resources: [...state.resources, ...action.resources],
      };
    } else {
      return state;
    }
  }
  if (action.type === 'deleted-resource') {
    return {
      ...state,
      resources: state.resources.filter(({ id }) => id !== action.id),
    };
  }
  return state;
}
