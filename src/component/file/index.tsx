import * as React from 'react';

import { FileData } from '../../reducer/file';

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
   * ファイルオープンをリクエスト
   */
  requestFileOpen(file: BrowserFile): void;
}
/**
 * ファイル管理パネル
 */
export default class FileComponent extends React.Component<IPropFile, {}> {
  public render() {
    const { file: { status, files }, requestFileOpen } = this.props;
    return (
      <div className={styles.wrapper}>
        {status !== 'loaded' ? (
          <p>Loading...</p>
        ) : (
          <FileList files={files} onOpenFile={requestFileOpen} />
        )}
      </div>
    );
  }
  public componentDidMount() {
    this.props.requestLoad();
  }
}
