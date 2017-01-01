import {
    createLogic,
} from './redux';
import {
    LoadFingerprintAction,
    LoadResourcesAction,
    AddResourcesAction,
    DeleteResourceAction,
    Resource,
} from '../action/resource';
import {
    LoadGameAction,
} from '../action/game';
import {
    SetMediaAction,
} from '../action/media';

import {
    getAugment,
} from '../game/format';
import randomString from '../util/random-string';

// --- Indexed Database
const DATABASE_NAME = 'masaoeditor';
// objectStore
const OS_RESOURCE = 'resource';

// --- LocalStorage
const FINGERPRINT_KEY = '_masaoeditor_fingerprint';

function openDatabase(): Promise<IDBDatabase>{
    return new Promise((resolve, reject)=>{
        const req = indexedDB.open(DATABASE_NAME, 1);

        req.onupgradeneeded = (ev)=>{
            const db = req.result;
            const oldVersion = ev.oldVersion || 0;

            // DBを初期化
            if (oldVersion < 1){
                db.createObjectStore(OS_RESOURCE, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
            }
        };
        req.onerror = (er)=>{
            reject(er);
        };
        req.onsuccess = ()=>{
            resolve(req.result);
        };
    });
}

const loadFingerprintLogic = createLogic<LoadFingerprintAction>({
    type: 'load-fingerprint',
    transform({action}, next){
        if (action.fingerprint == undefined){
            let fingerprint = localStorage.getItem(FINGERPRINT_KEY);
            if (fingerprint == null){
                // 新しいfingerprintを生成
                fingerprint = randomString();
                localStorage.setItem(FINGERPRINT_KEY, fingerprint);
            }
            next({
                ...action,
                fingerprint,
            });
        }else{
            next(action);
        }
    },
});

const loadResourceLogic = createLogic<LoadResourcesAction>({
    type: 'request-load-resources',
    process({}, dispatch, done){
        dispatch({
            type: 'resources-load-started',
        });
        const resources: Array<Resource> = [];
        openDatabase().then(db=>{
            return new Promise((resolve, reject)=>{
                const tx = db.transaction(OS_RESOURCE, 'readonly');

                const store = tx.objectStore(OS_RESOURCE);

                // 全てのリソースを取得
                const req = store.openCursor();
                req.onsuccess = ()=>{
                    const cursor = req.result;
                    if (cursor != null){
                        resources.push(cursor.value);
                        cursor.continue();
                    }else{
                        // 全てのリソースを取得できた
                        dispatch({
                            type: 'got-resources',
                            resources,
                        });
                        resolve();
                    }
                };
                req.onerror = (er=>{
                    reject(er);
                });
            });
        })
        .catch(er=>{
            dispatch({
                type: 'error',
                message: String(er),
            });
        })
        .then(done);
    }
});

const addResourcesLogic = createLogic<AddResourcesAction>({
    type: 'add-resources',
    process({action: {resources}}, dispatch, done){
        // indexedDBに追加
        openDatabase().then(db=> new Promise((resolve, reject)=>{
            const tx = db.transaction(OS_RESOURCE, 'readwrite');

            const store = tx.objectStore(OS_RESOURCE);
            const results: Array<Resource> = [];

            for (let resource of resources){
                const req = store.add(resource);
                req.onsuccess = ()=>{
                    // keyが発行された
                    results.push({
                        ...resource,
                        id: req.result,
                    });
                };
                req.onerror = (er)=>{
                    reject(er);
                };
            }
            tx.oncomplete = ()=>{
                // 全部入った
                dispatch({
                    type: 'new-resources',
                    resources: results,
                });
                resolve();
            };
            tx.onerror = (er)=>{
                reject(er);
            };
        }))
        .catch(er=>{
            dispatch({
                type: 'error',
                message: String(er),
            });
        })
        .then(done);

    }
});
const deleteResourceLogic = createLogic<DeleteResourceAction>({
    type: 'delete-resource',
    process({action: {id}}, dispatch, done){
        openDatabase().then(db=> new Promise((resolve, reject)=>{
            const tx = db.transaction(OS_RESOURCE, 'readwrite');

            const store = tx.objectStore(OS_RESOURCE);

            const req = store.delete(id);

            req.onerror = reject;
            tx.onerror = reject;
            tx.oncomplete = ()=>{
                dispatch({
                    type: 'deleted-resource',
                    id,
                });
                resolve();
            };
        }))
        .catch(er=>{
            dispatch({
                type: 'error',
                message: String(er),
            });
        })
        .then(done);
    }
});

const setMediaLogic = createLogic<SetMediaAction>({
    type: 'set-media',
    transform({action, getState}, next, reject){
        const {
            param,
            key,
            url,
        } = action;
        if (url != null){
            next(action);
            return;
        }
        // urlを取得したい
        const {
            resource: {
                resources,
            },
        } = getState();
        let ourl: string | null = null;
        for (let {id, blob} of resources){
            if (id === key){
                ourl = URL.createObjectURL(blob);
                break;
            }
        }
        if (ourl != null){
            next({
                ...action,
                url: ourl,
            });
            return;
        }
        // IDBの中から取得するしかない
        openDatabase().then(db=> new Promise((resolve, reject)=>{
            const tx = db.transaction(OS_RESOURCE, 'readonly');
            const store = tx.objectStore(OS_RESOURCE);
            const req = store.get(key);
            req.onerror = reject;
            req.onsuccess = ()=>{
                const obj: Resource | null = req.result;
                if (obj == null){
                    next(action);
                    return;
                }
                const {
                    blob,
                } = obj;
                const ourl = URL.createObjectURL(blob);
                next({
                    ...action,
                    url: ourl,
                });
                resolve();
            };
        }))
        .catch(er=>{
            reject({
                type: 'error',
                message: String(er),
            });
        })
    },
});

const loadGameLogic = createLogic<LoadGameAction>({
    type: 'load-game',
    process({action, getState}, dispatch, done){
        const {
            game,
        } = action;
        const {
            resource,
            media,
        } = getState();

        const augment = getAugment(game);

        dispatch({
            type: 'reset-media',
        });
        if (augment.fingerprint === resource.fingerprint){
            // fingerprintが一致したからリソースを読み込んでいい
            openDatabase().then(db=> new Promise((resolve, reject)=>{
                const tx = db.transaction(OS_RESOURCE, 'readonly');
                const store = tx.objectStore(OS_RESOURCE);
                
                // 指定されたメディア
                const mds = Object.keys(augment.media);
                const one: (i: number)=>void = (i: number)=>{
                    const param = mds[i];
                    if (param == null){
                        dispatch({
                            type: 'got-game',
                            game,
                        });
                        resolve();
                        return;
                    }
                    const mob = augment.media[param];
                    if (mob == null){
                        return one(i+1);
                    }
                    const {
                        key,
                    } = mob;
                    // keyで指定されたresourceを読み込む
                    const req = store.get(key);
                    req.onerror = reject;
                    req.onsuccess = ()=>{
                        const obj: Resource = req.result;
                        if (obj == null){
                            return one(i+1);
                        }
                        // メディアあった
                        const {
                            filename: name,
                            blob,
                        } = obj;
                        dispatch({
                            type: 'set-media',
                            param,
                            key,
                            name,
                            url: URL.createObjectURL(blob),
                        });
                        return one(i+1);
                    };
                };
                one(0);
            }))
            .catch(er=>{
                dispatch({
                    type: 'error',
                    message: String(er),
                });
            })
            .then(done);
        }else{
            // リソースは一切なし
            dispatch({
                type: 'got-game',
                game,
            });
            done();
        }
    },
});

export default [
    loadFingerprintLogic,
    loadResourceLogic,
    addResourcesLogic,
    deleteResourceLogic,
    setMediaLogic,
    loadGameLogic,
];
