// ゲームで使用するメディアの情報
import {
    Action,
} from '../action';

export interface MediaData{
    data: Record<string, OneMedia | undefined>;
}
export interface OneMedia{
    // ファイル名
    name: string;
    // resource key (もうないかもだけど)
    key: number;
    // 本体 (objectURL)
    url: string | undefined;
}

const initialData: MediaData = {
    data: {},
};

export default function(state = initialData, action: Action): MediaData{
    if (action.type === 'set-media'){
        return {
            ...state,
            data: {
                ...(state.data),
                [action.param]: {
                    name: action.name,
                    key: action.key,
                    url: action.url,
                },
            },
        };
    }
    if (action.type === 'unset-media'){
        return {
            ...state,
            data: {
                ...(state.data),
                [action.param]: undefined,
            },
        };
    }
    if (action.type === 'reset-media'){
        return {
            ...state,
            data: {},
        };
    }
    return state;
}
