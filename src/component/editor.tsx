import * as React from 'react';
import * as masao from 'masao';

import * as styles from './css/editor.css';

import { ResourceWithoutId } from '../action/resource';
import { Mode } from '../reducer/mode';
import { ResourceData } from '../reducer/resource';
import { MediaData } from '../reducer/media';
import { GameData } from '../reducer/game';
import { ErrorData } from '../reducer/error';
import { MasaoJSONFormat } from '../game/format';
import { getGameTitleFromMetadata } from '../game/metadata';
import { fileOpenDialog } from '../util/file-open';

import MasaoEditorCore, {
  EditState,
  Command,
  ExternalCommand,
} from 'masao-editor-core';

import MenuComponent from './menu';
import DropComponent from './drop';
import ErrorComponent from './error';
import { StatusBar } from './status';
import TestplayContainer from '../container/testplay';
import ResourceContainer from '../container/resource';
import FileContainer from '../container/file';
import KeyScreenComponent from '../component/key';

import { addResource } from '../game/param';
import { addEditorInfo } from '../game/format';
import { gameToHTML } from '../game/html';
import { loadFileAsGame } from '../game/load';

import download from '../util/download';
import AboutScreenComponent from './about';

interface IPropEditorComponent {
  mode: Mode;
  resource: ResourceData;
  media: MediaData;
  game: GameData;
  error: ErrorData;

  requestInit(): void;
  requestEditor(): void;
  requestResource(): void;
  requestFile(): void;
  requestTestplay(game: MasaoJSONFormat, startStage: number): void;
  requestKey(): void;
  requestAbout(): void;

  addFiles(resources: Array<ResourceWithoutId>): void;
  /**
   * ブラウザ内セーブを要求
   */
  requestSaveInBrowser(id: string, game: MasaoJSONFormat): void;
  /**
   * バックアップの作成を要求
   */
  requestBackup(game: MasaoJSONFormat): void;
  /**
   * updated状態の更新を要求
   */
  requestUpdate(updated: boolean): void;

  requestLoadGame(game: MasaoJSONFormat, newflag: boolean): void;

  requestError(message: string): void;
  requestCloseError(): void;
}
interface IStateEditorComponent {
  keyBinding: Record<string, Command>;
}
export default class EditorComponent extends React.Component<
  IPropEditorComponent,
  IStateEditorComponent
> {
  /**
   * Ref to MasaoEditorCore
   */
  protected core: MasaoEditorCore | null = null;
  /**
   * timer of backup script.
   */
  protected backupTimer: any = undefined;
  constructor(props: IPropEditorComponent) {
    super(props);
    this.handleTestplay = this.handleTestplay.bind(this);
    this.handleFileAccept = this.handleFileAccept.bind(this);
    this.handleBrowserSave = this.handleBrowserSave.bind(this);
    this.handleJSONSave = this.handleJSONSave.bind(this);
    this.handleHTMLSave = this.handleHTMLSave.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleFileOpen = this.handleFileOpen.bind(this);

    this.handleCommand = this.handleCommand.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);

    this.state = {
      keyBinding: {},
    };
  }
  componentDidMount() {
    this.props.requestInit();
    // イベント
    if (process.env.NODE_ENV === 'production') {
      window.addEventListener('beforeunload', this.handleBeforeUnload, false);
    }
    const { core } = this;
    if (core == null) {
      return;
    }

    const keyBinding = core.getKeyConfig();
    this.setState({
      keyBinding,
    });

    // バックアップのタイマーを登録
    this.backupTimer = setInterval(() => {
      if (this.props.game.saving !== 'saved') {
        this.props.requestBackup(this.generateGame());
      }
    }, 30000);
  }
  componentWillUnmount() {
    if (process.env.NODE_ENV === 'production') {
      window.removeEventListener(
        'beforeunload',
        this.handleBeforeUnload,
        false,
      );
    }
    if (this.backupTimer != null) {
      clearInterval(this.backupTimer);
      this.backupTimer = undefined;
    }
  }
  render() {
    const {
      requestEditor,
      requestResource,
      requestFile,
      requestCloseError,
      requestKey,
      requestAbout,
      requestUpdate,
      mode,
      media,
      game,
      error,
    } = this.props;
    const { keyBinding } = this.state;

    let subpain = null;
    if (mode === 'testplay') {
      subpain = (
        <div className={styles.screen}>
          <TestplayContainer />
        </div>
      );
    } else if (mode === 'resource') {
      subpain = (
        <div className={styles.screen}>
          <ResourceContainer />
        </div>
      );
    } else if (mode === 'file') {
      subpain = (
        <div className={styles.screen}>
          <FileContainer />
        </div>
      );
    } else if (mode === 'key') {
      subpain = (
        <div className={styles.screen}>
          <KeyScreenComponent binding={keyBinding} />
        </div>
      );
    } else if (mode === 'about') {
      subpain = (
        <div className={styles.screen}>
          <AboutScreenComponent />
        </div>
      );
    }

    let errorpain = null;
    if (error.message) {
      errorpain = (
        <ErrorComponent
          message={error.message}
          requestClose={requestCloseError}
        />
      );
    }

    // 画像の情報
    const urlFor = (media: MediaData, param: string, def: string) => {
      const o = media.data[param];
      if (o == null || o.url == null) {
        return def;
      }
      return o.url;
    };
    const filename_pattern = urlFor(media, 'filename_pattern', 'pattern.gif');
    const filename_mapchip = urlFor(media, 'filename_mapchip', 'mapchip.gif');
    // エディタはゲームを初期ロードするまで表示しない
    const editorStyle: React.CSSProperties = game.loaded
      ? {}
      : {
          visibility: 'hidden',
        };
    return (
      <div className={styles.wrapper}>
        <div className={styles.menu}>
          <MenuComponent
            mode={mode}
            requestEditor={requestEditor}
            requestResource={requestResource}
            requestFile={requestFile}
            requestTestplay={this.handleTestplay}
            requestKey={requestKey}
            requestAbout={requestAbout}
            requestFileOpen={this.handleFileOpen}
            requestSave={this.handleBrowserSave}
            requestJSONSave={this.handleJSONSave}
            requestHTMLSave={this.handleHTMLSave}
            requestNewGame={this.handleNewGame}
          />
        </div>
        <div className={styles.content}>
          <StatusBar
            saving={game.saving}
            title={getGameTitleFromMetadata(game.metadata)}
          />
          <div className={styles.editor} style={editorStyle}>
            <MasaoEditorCore
              ref={e => (this.core = e)}
              filename_mapchip={filename_mapchip}
              filename_pattern={filename_pattern}
              defaultGame={game.game}
              className={styles.editorInner}
              fit-y
              keyDisabled={subpain != null}
              onCommand={this.handleCommand}
              onUpdateFlag={requestUpdate}
              updateFlag={game.saving !== 'saved'}
            />
          </div>
          {subpain}
        </div>
        {errorpain}
        <DropComponent requestFileAccept={this.handleFileAccept} />
      </div>
    );
  }
  /**
   * 保存用のゲームデータを作成
   */
  protected generateGame(): MasaoJSONFormat {
    const { game: gameData, resource, media } = this.props;
    const { core } = this;
    if (core == null) {
      throw new Error('Cannot generate game');
    }
    const game1 = core.getCurrentGame();
    game1.params = masao.param.minimizeMapData(
      masao.param.cutDefaults(
        addResource('save', game1.params, this.props.media),
      ),
    );
    const advmap = game1['advanced-map'];
    if (advmap != null) {
      game1['advanced-map'] = masao.param.minimizeAdvancedData(advmap);
    }

    const game = addEditorInfo(game1, {
      id: gameData.id,
      metadata: gameData.metadata,
      resource,
      media,
    });
    return game;
  }
  // ------ メニューからの入力
  // テストプレイボタン
  private handleTestplay() {
    const { core } = this;
    if (core == null) {
      return;
    }
    const game = core.getCurrentGame();
    const stage = core.getCurrentStage();

    game.params = addResource('testplay', game.params, this.props.media);

    this.props.requestTestplay(game, stage);
  }
  // 保存ボタン
  private handleJSONSave() {
    const game = this.generateGame();

    // ファイルにして保存してもらう
    const blob = new Blob([JSON.stringify(game)], {
      type: 'application/json',
    });

    download('game.json', blob);
  }
  // HTMLの出力を要求された
  private handleHTMLSave() {
    const game = this.generateGame();
    const html = gameToHTML(game);

    const blob = new Blob([html], {
      type: 'text/html',
    });

    download('game.html', blob);
  }
  /**
   * ブラウザ内に保存する
   */
  protected handleBrowserSave() {
    const id = this.props.game.id;
    const game = this.generateGame();

    this.props.requestSaveInBrowser(id, game);
  }
  // ファイルがドロップされた
  private handleFileAccept(files: Array<File>) {
    const { addFiles, requestLoadGame, requestError } = this.props;
    // jsonファイルがあったら怪しい
    const one: (i: number) => void = (i: number) => {
      const f = files[i];
      if (f == null) {
        // 全部見たぞ
        addFiles(
          files.map(file => ({
            filename: file.name,
            blob: file,
          })),
        );
        return;
      }
      loadFileAsGame(f).then(
        game => {
          if (game == null) {
            // gameではなかった
            one(i + 1);
            return;
          }
          // gameがあった
          requestLoadGame(game, false);
        },
        er => {
          requestError(String(er));
        },
      );
    };
    one(0);
  }
  private handleNewGame() {
    // 新規のゲーム
    this.props.requestLoadGame(
      masao.format.make({
        version: 'fx16',
        params: masao.param.addDefaults({}),
        'advanced-map': {
          stages: [
            {
              size: { x: 180, y: 30 },
              layers: [],
            },
          ],
        },
      }),
      true,
    );
  }
  /**
   * Handle a file open button.
   */
  protected handleFileOpen() {
    fileOpenDialog('application/json, text/html').then(files => {
      this.handleFileAccept(files);
    });
  }
  /**
   * Handle a command from the editor.
   */
  protected handleCommand(command: ExternalCommand): void {
    switch (command.type) {
      case 'testplay': {
        // Testplay is requested.
        const { game, stage } = command;
        this.props.requestTestplay(game, stage);
        break;
      }
      case 'escape': {
        // escape.
        if (this.props.mode === 'testplay') {
          // テストプレイからエディタへの遷移
          this.props.requestEditor();
        }
        break;
      }
      case 'save': {
        // 保存コマンド
        if (command.kind === 'default') {
          this.handleBrowserSave();
        } else if (command.kind === 'json') {
          // JSONで保存
          this.handleJSONSave();
        } else {
          // HTMLで保存
          this.handleHTMLSave();
        }
      }
    }
  }
  private handleBeforeUnload(e: Event) {
    if (this.props.game.saving !== 'saved') {
      return ((e as any).returnValue = '現在編集中の内容は保存されません。');
    } else {
      return undefined;
    }
  }
}
