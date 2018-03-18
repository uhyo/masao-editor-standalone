import * as React from 'react';

import { Mode } from '../reducer/mode';

import * as styles from './css/menu.css';

interface IPropMenu {
  /**
   * 現在の画面
   */
  mode: Mode;
  /**
   * エディタ画面の表示をリクエスト
   */
  requestEditor(): void;
  /**
   * テストプレイ画面の表示をリクエスト
   */
  requestTestplay(): void;
  /**
   * リソース画面の表示をリクエスト
   */
  requestResource(): void;
  /**
   * ファイル管理画面の表示をリクエスト
   */
  requestFile(): void;
  /**
   * キー設定画面の表示をリクエスト
   */
  requestKey(): void;

  requestNewGame(): void;
  requestSave(): void;
  requestJSONSave(): void;
  requestHTMLSave(): void;
}

export default class MenuComponent extends React.PureComponent<IPropMenu, {}> {
  render() {
    const {
      mode,
      requestEditor,
      requestTestplay,
      requestResource,
      requestFile,
      requestKey,

      requestNewGame,
      requestSave,
      requestJSONSave,
      requestHTMLSave,
    } = this.props;
    const cls = (m: Mode) => (m === mode ? styles.active : styles.button);
    return (
      <div className={styles.wrapper}>
        <div onClick={requestEditor} className={cls('main')}>
          エディタ
        </div>
        <div onClick={requestTestplay} className={cls('testplay')}>
          テストプレイ
        </div>
        <div onClick={requestResource} className={cls('resource')}>
          リソース
        </div>
        <div onClick={requestFile} className={cls('file')}>
          ファイル
        </div>
        <div className={styles.separator} />
        <div onClick={requestNewGame} className={styles.button}>
          新規
        </div>
        <div onClick={requestSave} className={styles.button}>
          上書き保存
        </div>
        <div onClick={requestJSONSave} className={styles.button}>
          JSON出力
        </div>
        <div onClick={requestHTMLSave} className={styles.button}>
          HTML出力
        </div>
        <div className={styles.separator} />
        <div onClick={requestKey} className={cls('key')}>
          キー設定
        </div>
      </div>
    );
  }
}
