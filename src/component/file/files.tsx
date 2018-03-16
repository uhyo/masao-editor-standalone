import * as React from 'react';

import { uis } from 'masao-editor-core';

import { BrowserFile } from '../../action/file';

import * as styles from '../css/file.css';

const { Button } = uis;

export interface IPropFileList {
  /**
   * 表示するファイルのリスト
   */
  files: BrowserFile[];
  /**
   * ファイルを開くイベント
   */
  onOpenFile(file: BrowserFile): void;
}
/**
 * ファイルリストの表示
 */
export class FileList extends React.Component<IPropFileList, {}> {
  public render() {
    const { files, onOpenFile } = this.props;

    return (
      <div>
        {files.map(file => {
          // ファイル名
          const name =
            (file.data.metadata && file.data.metadata.title) || '無題';
          return (
            <div key={file.id} className={styles.filebox}>
              <div className={styles.filename}>{name}</div>
              <div>
                最終更新日時：{file.lastModified.toLocaleString('ja-JP')}
              </div>
              <div>
                <Button onClick={() => onOpenFile(file)}>開く</Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
