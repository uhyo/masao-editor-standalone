import * as React from 'react';

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
}
/**
 * ファイル管理パネル
 */
export default class FileComponent extends React.Component<IPropFile, {}> {
  public render() {
    const {
      file: { status, files },
      requestFileOpen,
      requestFilePreview,
      requestFileDelete,
    } = this.props;
    return (
      <div className={styles.wrapper}>
        {status !== 'loaded' ? (
          <p>Loading...</p>
        ) : (
          <FileList
            files={files}
            onOpenFile={requestFileOpen}
            onPreviewFile={requestFilePreview}
            onDeleteFile={requestFileDelete}
          />
        )}
      </div>
    );
  }
  public componentDidMount() {
    this.props.requestLoad();
  }
}
