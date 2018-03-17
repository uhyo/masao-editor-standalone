import * as React from 'react';

import { uis } from 'masao-editor-core';

import { BrowserFile } from '../../action/file';
import { MasaoJSONFormat } from '../../game/format';
import { getGameTitle } from '../../game/metadata';

import * as styles from '../css/file.css';
import { MetadataEdit } from './metadata';

const { Button } = uis;

export interface IPropFileList {
  /**
   * 表示するファイルのリスト
   */
  files: BrowserFile[];
  /**
   * 現在開かれているゲームのID
   */
  current: string;
  /**
   * 現在メタ情報を編集中のゲームのID
   */
  editingfile: string | undefined;
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
  /**
   * メタデータを編集中のファイルを変更するイベント
   */
  onSetEditingFile(id: string | undefined): void;
  /**
   * ファイルをブラウザに保存しなおすイベント
   */
  onSaveOnBrowser(file: BrowserFile): void;
}
export interface IStateFileList {}
/**
 * ファイルリストの表示
 */
export class FileList extends React.Component<IPropFileList, IStateFileList> {
  constructor(props: IPropFileList) {
    super(props);
  }
  public render() {
    const {
      files,
      current,
      editingfile,
      onOpenFile,
      onPreviewFile,
      onDeleteFile,
      onSetEditingFile,
      onSaveOnBrowser,
    } = this.props;

    return (
      <div>
        {files.map(file => {
          // ファイル名
          const name = getGameTitle(file.data);
          // このファイルの情報を編集中か
          const ed = editingfile === file.id;
          if (ed) {
            return (
              <div
                key={file.id}
                className={`${styles.filebox} ${styles.editing}`}
              >
                <MetadataEdit file={file} onSave={onSaveOnBrowser} />
              </div>
            );
          } else {
            return (
              <div
                key={file.id}
                className={styles.filebox}
                onDoubleClick={() => onOpenFile(file)}
              >
                <div className={styles.filename}>
                  {name}
                  {current === file.id ? <b>編集中</b> : null}
                </div>
                <div>
                  最終更新日時：{file.lastModified.toLocaleString('ja-JP')}
                </div>
                <div className={styles.controls}>
                  <div>
                    <Button onClick={() => onOpenFile(file)}>開く</Button>
                  </div>
                  <div>
                    <Button onClick={() => onSetEditingFile(file.id)}>
                      情報編集
                    </Button>
                  </div>
                  <div>
                    <Button onClick={() => onDeleteFile(file)}>削除</Button>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}
