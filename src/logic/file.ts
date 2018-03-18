import { createLogic } from './redux';
import {
  BrowserFile,
  LoadFilesAction,
  SaveInBrowserAction,
  BackupAction,
  LoadLastAction,
  DeleteFileAction,
} from '../action/file';
import { getGameTitle, extractMetadata } from '../game/metadata';

import randomString from '../util/random-string';

import {
  DATABASE_NAME,
  OS_FILE,
  IDX_FILE_LASTMODIFIED,
  LAST_ID_KEY,
  BACKUP_KEY,
  openDatabase,
} from './db';

/**
 * ファイルをDBからロードするロジック
 */
const loadFileLogic = createLogic<LoadFilesAction>({
  type: 'request-load-files',
  process({}, dispatch, done) {
    dispatch({
      type: 'file-load-started',
    });
    // 結果の配列
    const files: BrowserFile[] = [];

    openDatabase()
      .then(db => {
        return new Promise((resolve, reject) => {
          const tx = db.transaction(OS_FILE, 'readonly');
          const store = tx.objectStore(OS_FILE);
          const idx = store.index(IDX_FILE_LASTMODIFIED);

          // 全てのファイルを取得（新しい順に）
          const req = idx.openCursor(undefined, 'prev');
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor != null) {
              files.push(cursor.value);
              cursor.continue();
            } else {
              // 終了
              dispatch({
                type: 'got-files',
                files,
              });
              resolve();
            }
          };
          req.onerror = reject;
        });
      })
      .catch(er => {
        dispatch({
          type: 'error',
          message: String(er),
        });
      })
      .then(done);
  },
});

/**
 * ファイルをブラウザにセーブするロジック
 */
const saveInBrowserLogic = createLogic<SaveInBrowserAction>({
  type: 'file-save-in-browser',
  process({ action: { id, game }, getState }, dispatch, done) {
    openDatabase()
      .then(
        db =>
          new Promise((resolve, reject) => {
            const tx = db.transaction(OS_FILE, 'readwrite');
            const store = tx.objectStore(OS_FILE);

            const file: BrowserFile = {
              id,
              lastModified: new Date(),
              data: game,
            };
            // update or insert
            const res = store.put(file);
            res.onsuccess = () => {
              // これが最新なのでlocalStorageにIDを保存
              localStorage.setItem(LAST_ID_KEY, id);
              resolve();
              const { game: { id: currentId }, file: { status } } = getState();
              if (status === 'loading') {
                // 再ロードする
                dispatch({
                  type: 'request-load-files',
                });
              }
              if (currentId === id) {
                // 現在開いているファイルが更新された

                // のでバックアップは削除
                dispatch({
                  type: 'file-backup',
                  game: undefined,
                });
                // 保存済状態に変更
                dispatch({
                  type: 'game-update-saving',
                  saving: 'saved',
                });
                dispatch({
                  type: 'load-game',
                  id,
                  game,
                  new: false,
                  gotoMain: false,
                });
              }
            };
            res.onerror = reject;
          }),
      )
      .catch(er => {
        dispatch({
          type: 'error',
          message: String(er),
        });
      })
      .then(done);
  },
});

/**
 * 前回開いていたファイルを読み込むロジック
 */
const loadLastLogic = createLogic<LoadLastAction>({
  type: 'file-load-last',
  process({ getState }, dispatch, done) {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup != null) {
      // バックアップがあった
      const game = JSON.parse(backup);
      dispatch({
        type: 'load-game',
        id: undefined,
        game,
        new: true,
        gotoMain: false,
      });
      return;
    }
    // localStorageから最後に開いていたやつを読み込む
    const lastid = localStorage.getItem(LAST_ID_KEY);

    if (!lastid) {
      // ないよ
      return;
    }

    openDatabase()
      .then(
        db =>
          new Promise((resolve, reject) => {
            const tx = db.transaction(OS_FILE, 'readonly');
            const store = tx.objectStore(OS_FILE);

            const req = store.get(lastid);
            req.onsuccess = () => {
              const doc: BrowserFile | undefined = req.result;

              if (doc == null) {
                // そんなものはない
                const { id, metadata, game } = getState().game;
                dispatch({
                  type: 'got-game',
                  id,
                  metadata,
                  game,
                });
                return;
              }
              // ゲームを読み込んだ
              const { id, data: game } = doc;
              dispatch({
                type: 'got-game',
                id,
                metadata: extractMetadata(game),
                game,
              });
              dispatch({
                type: 'game-update-saving',
                saving: 'saved',
              });

              resolve();
            };
            req.onerror = reject;
          }),
      )
      .catch(er => {
        dispatch({
          type: 'error',
          message: String(er),
        });
      })
      .then(done);
  },
});

/**
 * ファイルを削除するロジック
 */
const deleteFileLogic = createLogic<DeleteFileAction>({
  type: 'file-delete',
  validate({ action }, allow, reject) {
    const { file } = action;
    const title = getGameTitle(file.data);
    // 削除していいか聞く
    const res = confirm(`本当に「${title}」を削除しますか？`);

    if (res) {
      allow(action);
    } else {
      reject(action);
    }
  },
  process({ action, getState }, dispatch, next) {
    openDatabase()
      .then(
        db =>
          new Promise((resolve, reject) => {
            const tx = db.transaction(OS_FILE, 'readwrite');
            const store = tx.objectStore(OS_FILE);

            const res = store.delete(action.file.id);
            res.onsuccess = () => {
              resolve();
              const { file: { status } } = getState();
              if (status === 'loaded') {
                // 再ロード
                dispatch({
                  type: 'request-load-files',
                });
              }
            };
            res.onerror = reject;
          }),
      )
      .catch(er => dispatch({ type: 'error', message: String(er) }))
      .then(next);
  },
});

/**
 * 現在編集中のやつをバックアップする
 */
const backupLogic = createLogic<BackupAction>({
  type: 'file-backup',
  process({ action: { game } }, _, done) {
    if (game == null) {
      // この場合はバックアップを削除
      localStorage.removeItem(BACKUP_KEY);
    } else {
      // バックアップをlocalStorageに保存
      localStorage.setItem(BACKUP_KEY, JSON.stringify(game));
    }
    done();
  },
});

// export all logics.
export default [
  loadFileLogic,
  saveInBrowserLogic,
  loadLastLogic,
  deleteFileLogic,
  backupLogic,
];
