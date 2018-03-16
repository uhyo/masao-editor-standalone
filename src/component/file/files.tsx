import * as React from 'react';

import { uis } from 'masao-editor-core';

import { BrowserFile } from '../../action/file';
import { MasaoJSONFormat } from '../../game/format';
import { getGameTitle } from '../../game/metadata';

import * as styles from '../css/file.css';

const { Button } = uis;

export interface IPropFileList {
  /**
   * 表示するファイルのリスト
   */
  files: BrowserFile[];
  /**
   * ファイルをまだ開かないけどプレビューする
   */
  onPreviewFile(game: MasaoJSONFormat): void;
  /**
   * ファイルを開くイベント
   */
  onOpenFile(file: BrowserFile): void;
  /**
   * ファイルを削除するイベント
   */
  onDeleteFile(file: BrowserFile): void;
}
/**
 * ファイルリストの表示
 */
export class FileList extends React.Component<IPropFileList, {}> {
  public render() {
    const { files, onOpenFile, onPreviewFile, onDeleteFile } = this.props;

    return (
      <div>
        {files.map(file => {
          // ファイル名
          const name = getGameTitle(file.data);
          return (
            <div
              key={file.id}
              className={styles.filebox}
              onDoubleClick={() => onOpenFile(file)}
            >
              <div className={styles.filename}>{name}</div>
              <div>
                最終更新日時：{file.lastModified.toLocaleString('ja-JP')}
              </div>
              <div className={styles.controls}>
                <div>
                  <Button onClick={() => onOpenFile(file)}>開く</Button>
                </div>
                <div>
                  <Button onClick={() => onDeleteFile(file)}>削除</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
