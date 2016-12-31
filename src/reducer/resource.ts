import {
    Action,
} from '../action';
import {
    Resource,
    SetResourceSizeAction,
} from '../action/resource';

export {
    Resource,
};

export interface ResourceData{
    // ロード中か
    loading: boolean;
    // 表示サイズ
    size: SetResourceSizeAction['size'];
    // 読んだリソース
    resources: Array<Resource>;
}

const initialData: ResourceData = {
    loading: false,
    size: 'middle',
    resources: [],
};

export default function (state = initialData, action: Action): ResourceData{
    if (action.type === 'set-resource-size'){
        return {
            ...state,
            size: action.size,
        };
    }
    if (action.type === 'resources-load-started'){
        return {
            ...state,
            loading: true,
        };
    }
    if (action.type === 'got-resources'){
        return {
            ...state,
            loading: false,
            resources: [...(action.resources)],
        };
    }
    if (action.type === 'new-resources'){
        return {
            ...state,
            resources: [...state.resources, ...(action.resources)],
        };
    }
    if (action.type === 'deleted-resource'){
        return {
            ...state,
            resources: state.resources.filter(({id})=> id !== action.id),
        };
    }
    return state;
}
