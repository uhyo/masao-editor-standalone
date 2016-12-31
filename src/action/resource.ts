// リソース管理

export interface ResourceWithoutId{
    // original file name
    filename: string;
    // file data
    blob: Blob;
}
export interface Resource extends ResourceWithoutId{
    // リソースID
    id: number;
}

// ロードを要求
export interface LoadFingerprintAction{
    type: 'load-fingerprint';
    fingerprint?: string;
}
export interface LoadResourcesAction{
    type: 'request-load-resources';
}
// 新しいリソースを追加
export interface AddResourcesAction{
    type: 'add-resources';

    resources: Array<ResourceWithoutId>;
}
export interface DeleteResourceAction{
    type: 'delete-resource';
    id: number;
}
// リソース一覧の表示サイズ
export interface SetResourceSizeAction{
    type: 'set-resource-size';

    size: 'small' | 'middle' | 'large';
}

// ----- logicの後

// ロード開始
export interface LoadStartedAction{
    type: 'resources-load-started';
}
// リソース一覧を取得
export interface GotResourcesAction{
    type: 'got-resources';

    resources: Array<Resource>;
}
// 新リソースが追加された
export interface NewResourcesAction{
    type: 'new-resources';

    resources: Array<Resource>;
}
export interface DeletedResourceAction{
    type: 'deleted-resource';

    id: number;
}

export type ResourceActions =
    LoadFingerprintAction |
    LoadResourcesAction |
    AddResourcesAction |
    DeleteResourceAction |
    SetResourceSizeAction |
    LoadStartedAction |
    GotResourcesAction |
    NewResourcesAction |
    DeletedResourceAction;
