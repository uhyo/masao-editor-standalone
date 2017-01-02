import * as React from 'react';
import * as masao from 'masao';

import * as styles from './css/editor.css';

import {
    ResourceWithoutId,
} from '../action/resource';
import {
    Mode,
} from '../reducer/mode';
import {
    ResourceData,
} from '../reducer/resource';
import {
    MediaData,
} from '../reducer/media';
import {
    GameData,
} from '../reducer/game';

import MasaoEditorCore, { EditState } from 'masao-editor-core';

import MenuComponent from './menu';
import DropComponent from './drop';
import TestplayContainer from '../container/testplay';
import ResourceContainer from '../container/resource';

import {
    addResource,
} from '../game/param';
import {
    addEditorInfo,
} from '../game/format';
import {
    gameToHTML,
} from '../game/html';
import {
    loadFileAsGame,
} from '../game/load';

import download from '../util/download';

interface IPropEditorComponent{
    mode: Mode;
    resource: ResourceData;
    media: MediaData;
    game: GameData;

    requestInit(): void;
    requestEditor(): void;
    requestResource(): void;
    requestTestplay(game: any, startStage: number): void;

    addFiles(resources: Array<ResourceWithoutId>): void;

    requestLoadGame(game: any): void;
}
export default class EditorComponent extends React.Component<IPropEditorComponent, {}>{
    constructor(props: IPropEditorComponent){
        super(props);
        this.handleTestplay = this.handleTestplay.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleFileAccept = this.handleFileAccept.bind(this);
        this.handleHTML = this.handleHTML.bind(this);
    }
    componentDidMount(){
        this.props.requestInit();
    }
    render(){
        const {
            requestEditor,
            requestResource,
            mode,
            media,
            game,
        } = this.props;

        let subpain = null;
        if (mode === 'testplay'){
            subpain = <div className={styles.screen}><TestplayContainer/></div>;
        }else if (mode === 'resource'){
            subpain = <div className={styles.screen}><ResourceContainer/></div>;
        }

        // 画像の情報
        const urlFor = (media: MediaData, param: string, def: string)=>{
            const o = media.data[param];
            if (o == null || o.url == null){
                return def;
            }
            return o.url;
        };
        const filename_pattern = urlFor(media, 'filename_pattern', 'pattern.gif');
        const filename_mapchip = urlFor(media, 'filename_mapchip', 'mapchip.gif');
        return <div className={styles.wrapper}>
            <div className={styles.menu}>
                <MenuComponent
                    mode={mode}
                    requestEditor={requestEditor}
                    requestResource={requestResource}
                    requestTestplay={this.handleTestplay}
                    requestSave={this.handleSave}
                    requestHTML={this.handleHTML}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.editor}>
                    <MasaoEditorCore
                        ref="core"
                        filename_mapchip={filename_mapchip}
                        filename_pattern={filename_pattern}
                        defaultGame={game.game}
                    />
                </div>
                {subpain}
            </div>
            <DropComponent requestFileAccept={this.handleFileAccept}/>
        </div>;
    }
    // ------ メニューからの入力
    // テストプレイボタン
    private handleTestplay(){
        const core = this.refs['core'] as MasaoEditorCore;
        const game = core.getCurrentGame();
        const stage = core.getCurrentStage();

        this.props.requestTestplay(game, stage);
    }
    // 保存ボタン
    private handleSave(){
        const {
            resource,
            media,
        } = this.props;
        const core = this.refs['core'] as MasaoEditorCore;
        const game1 = core.getCurrentGame();

        game1.params = addResource('save', game1.params, this.props.media);

        const game = addEditorInfo(game1, resource, media);

        // ファイルにして保存してもらう
        const blob = new Blob([JSON.stringify(game)], {
            type: 'application/json',
        });

        download('game.json', blob);
    }
    // HTMLの出力を要求された
    private handleHTML(){
        const {
            resource,
            media,
        } = this.props;

        const core = this.refs['core'] as MasaoEditorCore;
        const game1 = core.getCurrentGame();

        game1.params = addResource('save', game1.params, this.props.media);
        const game = addEditorInfo(game1, resource, media);
        const html = gameToHTML(game);

        const blob = new Blob([html], {
            type: 'text/html',
        });

        download('game.html', blob);
    }
    // ファイルがドロップされた
    private handleFileAccept(files: Array<File>){
        const {
            addFiles,
            requestLoadGame,
        } = this.props;
        // jsonファイルがあったら怪しい
        const one: (i: number)=>void = (i: number)=>{
            const f = files[i];
            if (f == null){
                // 全部見たぞ
                addFiles(files.map(file=>({
                    filename: file.name,
                    blob: file,
                })));
                return;
            }
            loadFileAsGame(f)
            .then(game=>{
                if (game == null){
                    // gameではなかった
                    one(i+1);
                    return;
                }
                // gameがあった
                requestLoadGame(game);
            }, er=>{
                console.error(er);
                one(i+1);
            });
        };
        one(0);
    }
}
