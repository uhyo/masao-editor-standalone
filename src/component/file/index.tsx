import * as React from 'react';

import { FileData } from '../../reducer/file';

import * as styles from '../css/file.css';

interface IPropFile {
  /**
   * ファイル関連のデータ
   */
  file: FileData;
  /**
   * データの読み込みをリクエスト
   */
  requestLoad(): void;
}
/**
 * ファイル管理パネル
 */
export default class FileComponent extends React.Component<IPropFile, {}> {
  public render() {
    const { file: { status } } = this.props;
    return <div className={styles.wrapper}>{status}</div>;
  }
  public componentDidMount() {
    this.props.requestLoad();
  }
}
