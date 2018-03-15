// Data for using IndexedDB.

/**
 * Name of database.
 */
export const DATABASE_NAME = 'masaoeditor';

/**
 * Version of DB.
 */
export const DATABASE_VERSION = 2;

/**
 * Name of ObjectStore to store resources.
 */
export const OS_RESOURCE = 'resource';
/**
 * name of ObjectStore to store files.
 */
export const OS_FILE = 'file';

/**
 * name of file.lastModified index.
 */
export const IDX_FILE_LASTMODIFIED = 'lastModified';

/**
 * Key of localStorage for browser fingerprint.
 */
export const FINGERPRINT_KEY = '_masaoeditor_fingerprint';

/**
 * Key of localStorage for id last opened game.
 */
export const LAST_ID_KEY = '_masaoeditor_last_id';

/**
 * Open the database.
 */
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    req.onupgradeneeded = ev => {
      const db: IDBDatabase = req.result;
      const oldVersion = ev.oldVersion || 0;

      // DBを初期化
      if (oldVersion < 1) {
        db.createObjectStore(OS_RESOURCE, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
      if (oldVersion < 2) {
        const store = db.createObjectStore(OS_FILE, {
          keyPath: 'id',
          autoIncrement: false,
        });
        store.createIndex(IDX_FILE_LASTMODIFIED, 'lastModified');
      }
    };
    req.onerror = er => {
      reject(er);
    };
    req.onsuccess = () => {
      resolve(req.result);
    };
  });
}
