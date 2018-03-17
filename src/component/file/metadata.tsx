import * as React from 'react';

import { uis } from 'masao-editor-core';

import { BrowserFile } from '../../action/file';
import { MasaoJSONFormat } from '../../game/format';
import { writeMetadata } from '../../game/metadata';

import * as styles from '../css/file.css';

const { Button } = uis;

export interface IPropMetadataEdit {
  /**
   * メタデータを編集するファイル
   */
  file: BrowserFile;
  /**
   * メタデータ編集後のファイルを送信する
   */
  onSave(file: BrowserFile): void;
}
export interface IStateMetadataEdit {
  /**
   * title of this game.
   */
  title: string;
  /**
   * author of this game.
   */
  author: string;
}

/**
 * メタデータを編集するコンポーネント
 */
export class MetadataEdit extends React.Component<
  IPropMetadataEdit,
  IStateMetadataEdit
> {
  /**
   * Ref to name area.
   */
  protected titleArea: HTMLInputElement | null = null;
  constructor(props: IPropMetadataEdit) {
    super(props);
    this.state = this.getMetadataFromGame(props.file.data);

    this.handleTitleInput = this.handleTitleInput.bind(this);
    this.handleAuthorInput = this.handleAuthorInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // XXX waiting for React 16.3
  protected getMetadataFromGame(game: MasaoJSONFormat): IStateMetadataEdit {
    const title = (game.metadata && game.metadata.title) || '';
    const author = (game.metadata && game.metadata.author) || '';
    return {
      title,
      author,
    };
  }
  public componentWillReceiveProps(nextProps: IPropMetadataEdit) {
    if (this.props.file !== nextProps.file) {
      // リセットされた
      this.setState(this.getMetadataFromGame(nextProps.file.data));
    }
  }
  public componentDidMount() {
    const { titleArea } = this;
    if (titleArea != null) {
      titleArea.focus();
    }
  }
  public render() {
    const { title, author } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={styles.editWrapper}>
          <span>ステージ名</span>
          <span>
            <input
              ref={e => (this.titleArea = e)}
              placeholder="無題"
              value={title}
              onChange={this.handleTitleInput}
            />
          </span>
          <span>作者名</span>
          <span>
            <input value={author} onChange={this.handleAuthorInput} />
          </span>
        </div>
        <div>
          <Button onClick={this.handleSubmit}>決定</Button>
        </div>
        {/* dummy button */}
        <input type="submit" style={{ display: 'none' }} />
      </form>
    );
  }
  /**
   *ステージ名の入力を反映
   */
  protected handleTitleInput(e: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({
      title: e.currentTarget.value,
    });
  }
  /**
   * 作者名の入力を反映
   */
  protected handleAuthorInput(e: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({
      author: e.currentTarget.value,
    });
  }
  /**
   * 保存ボタンを押した
   */
  protected handleSubmit(e?: React.SyntheticEvent<any>) {
    if (e != null) {
      e.preventDefault();
    }
    // メタデータを書き換える
    const { file, onSave } = this.props;
    const { title, author } = this.state;
    writeMetadata(file.data, {
      title,
      author,
    });
    onSave(file);
  }
}
