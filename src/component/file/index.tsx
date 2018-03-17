import * as React from 'react';

import { GameData } from '../../reducer/game';
import { FileData } from '../../reducer/file';
import { MasaoJSONFormat } from '../../game/format';

import * as styles from '../css/file.css';

import { FileList } from './files';
import { BrowserFile } from '../../action/file';
interface IPropFile {
  /**
   * ファイル関連のデータ
   */
  file: FileData;
  /**
   * 現在のゲームの情報
   */
  game: GameData;
  /**
   * データの読み込みをリクエスト
   */
  requestLoad(): void;
  /**
   * ファイルをプレビュー
   */
  requestFilePreview(file: MasaoJSONFormat): void;
  /**
   * ファイルオープンをリクエスト
   */
  requestFileOpen(file: BrowserFile): void;
  /**
   * ファイルの削除をリクエスト
   */
  requestFileDelete(file: BrowserFile): void;
  /**
   * メタデータ編集中のファイルの設定をリクエスト
   */
  requestSetEditingFile(id: string | undefined): void;
  /**
   * ファイルのブラウザへの保存をリクエスト
   */
  requestSaveOnBrowser(file: BrowserFile): void;
}
/**
 * ファイル管理パネル
 */
export default class FileComponent extends React.PureComponent<IPropFile, {}> {
  public render() {
    const {
      file: { status, files, editingfile },
      game,
      requestFileOpen,
      requestFilePreview,
      requestFileDelete,
      requestSetEditingFile,
      requestSaveOnBrowser,
    } = this.props;
    return (
      <div className={styles.wrapper}>
        {status !== 'loaded' ? (
          <p>Loading...</p>
        ) : (
          <FileList
            current={game.id}
            files={files}
            editingfile={editingfile}
            onOpenFile={requestFileOpen}
            onPreviewFile={requestFilePreview}
            onDeleteFile={requestFileDelete}
            onSetEditingFile={requestSetEditingFile}
            onSaveOnBrowser={file => {
              requestSaveOnBrowser(file);
              requestSetEditingFile(undefined);
            }}
          />
        )}
      </div>
    );
  }
  public componentDidMount() {
    this.props.requestLoad();
  }
}
