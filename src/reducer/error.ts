import { Action } from '../action';

// エラー表示状態
export interface ErrorData {
  message: string | undefined;
}

const initialData: ErrorData = {
  message: undefined,
};

export default function errorReducer(
  state = initialData,
  action: Action,
): ErrorData {
  if (action.type === 'error') {
    return {
      message: action.message,
    };
  } else if (action.type === 'clear-error') {
    return {
      message: undefined,
    };
  }
  return state;
}
