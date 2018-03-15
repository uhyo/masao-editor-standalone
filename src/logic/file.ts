import { createLogic } from './redux';
import {
  BrowserFile,
  LoadFilesAction,
  SaveInBrowserAction,
} from '../action/file';

import randomString from '../util/random-string';

import {
  DATABASE_NAME,
  OS_FILE,
  IDX_FILE_LASTMODIFIED,
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
              resolve();
              const { file: { status } } = getState();
              if (status === 'loading') {
                // 再ロードする
                dispatch({
                  type: 'request-load-files',
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

// export all logics.
export default [loadFileLogic, saveInBrowserLogic];
