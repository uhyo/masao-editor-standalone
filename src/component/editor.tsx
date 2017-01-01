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

import download from '../util/download';

const defaultValue = masao.format.make({
    params: {
        "map0-0" : "............................................................",
        "map0-1" : "............................................................",
        "map0-2" : "............................................................",
        "map0-3" : "............................................................",
        "map0-4" : "............................................................",
        "map0-5" : "............................................................",
        "map0-6" : "............................................................",
        "map0-7" : "............................................................",
        "map0-8" : "............................................................",
        "map0-9" : "............................................................",
        "map0-10": "............................................................",
        "map0-11": "............................................................",
        "map0-12": "............................................999.............",
        "map0-13": "............................................999.............",
        "map0-14": "............................................................",
        "map0-15": "............................................aaa.............",
        "map0-16": "............................................................",
        "map0-17": "............................................................",
        "map0-18": "...............................99...........................",
        "map0-19": "............................................................",
        "map0-20": "............................................................",
        "map0-21": "............................................................",
        "map0-22": "...12...............12.....9.9...aaa.....aa.aaaaaaaa...12...",
        "map0-23": ".............B............aaaaa..............9.aaaaa........",
        "map0-24": ".........aaaaa..........................B...aaaaaaaa........",
        "map0-25": "....9.9.............................aaaaa...9.9aa999........",
        "map0-26": "....aaa...............B.............9.9.9...aaaaaaaa........",
        "map0-27": "...........aaaaaa..aaaaaa....................9.aaaaa........",
        "map0-28": ".A........aaaaaaa..aaaaaa............D......aaaaaaaa........",
        "map0-29": "bbbbbbbbbbbbbbbbb..bbbbbb.bbbbbbbbbbbbbbbbbbbbbbbbbb5bbbbbb.",
        "map1-0" : "............................................................",
        "map1-1" : "............................................................",
        "map1-2" : "............................................................",
        "map1-3" : "............................................................",
        "map1-4" : "............................................................",
        "map1-5" : "............................................................",
        "map1-6" : "............................................................",
        "map1-7" : "............................................................",
        "map1-8" : "............................................................",
        "map1-9" : "............................................................",
        "map1-10": "............................................................",
        "map1-11": "............................................................",
        "map1-12": "............................................................",
        "map1-13": "............................................................",
        "map1-14": "............................................................",
        "map1-15": "............................................................",
        "map1-16": "............................................................",
        "map1-17": "............................................................",
        "map1-18": "............................................................",
        "map1-19": "............................................................",
        "map1-20": "............................................................",
        "map1-21": "............................................................",
        "map1-22": "...12....12.....12.....12....12....12.......................",
        "map1-23": "............................................................",
        "map1-24": "............................................................",
        "map1-25": "...................O........................................",
        "map1-26": ".................aaaa...................feef................",
        "map1-27": ".............aaaaaaaaaaa................e..e..............E.",
        "map1-28": "..........O..aaaaaaaaaaa.O.....O........feefeef..feeeefeeeef",
        "map1-29": "..bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.......e..e..e..e....e....e",
        "map2-0" : "............................................................",
        "map2-1" : "............................................................",
        "map2-2" : "............................................................",
        "map2-3" : "............................................................",
        "map2-4" : "............................................................",
        "map2-5" : "............................................................",
        "map2-6" : "............................................................",
        "map2-7" : "............................................................",
        "map2-8" : "............................................................",
        "map2-9" : "............................................................",
        "map2-10": "............................................................",
        "map2-11": "............................................................",
        "map2-12": "............................................................",
        "map2-13": "............................................................",
        "map2-14": "............................................................",
        "map2-15": "............................................................",
        "map2-16": "............................................................",
        "map2-17": "............................................................",
        "map2-18": "............................................................",
        "map2-19": "............................................................",
        "map2-20": "............................................................",
        "map2-21": "........................................................8...",
        "map2-22": "..................99........12.....12....12....12.......a...",
        "map2-23": "..................dd...................................aaa..",
        "map2-24": "..e.ef...................9.9.9.9......................aaaaa.",
        "map2-25": "..e..e.............................................F.aaaaaaa",
        "map2-26": "..e..e.......E..............................aaaaaaaaaaaaaaaa",
        "map2-27": "..e..e.feeefeeef..99...................F....aaaaaaaaaaaaaaaa",
        "map2-28": "..feef.e...e...e..dd...aaaaaaaaaaaaaaaaaaa..aaaaaaaaaaaaaaaa",
        "map2-29": "..e..e.e...e...e.......aaaaaaaaaaaaaaaaaaa..aaaaaaaaaaaaaaaa",
        "time_max": "200",
        "scroll_mode": "1",
        "score_v": "1",
        "j_tail_type": "1",
        "j_tail_hf": "1",
        "j_fire_mkf": "1",
        "grenade_type": "1",
        "suberuyuka_hkf": "1",
        "dengeki_mkf": "1",
        "yachamo_kf": "1",
        "airms_kf": "1",
        "ugokuyuka1_type": "1",
        "ugokuyuka2_type": "1",
        "ugokuyuka3_type": "1",
        "boss_type": "1",
        "boss3_type": "1",
        "url1": "http://www.t3.rim.or.jp/~naoto/naoto.html",
        "url2": "http://www.t3.rim.or.jp/~naoto/j_con/index.html",
        "url3": "http://www.t3.rim.or.jp/~naoto/naoto.html",
        "url4": "http://www.t3.rim.or.jp/~naoto/j_con/index.html",
        "hitokoto1_name": "浩二",
        "hitokoto1-1": "今日は、いい天気だなあ、なんてね。",
        "hitokoto1-2": "プレイ画面でも、こんなセリフを、",
        "hitokoto1-3": "入れられるように、なったんだ。",
        "hitokoto2_name": "お姫様",
        "hitokoto2-1": "ついに、ここまで来ましたね。",
        "hitokoto2-2": "ゆうきの証、ミレニアム人面星が、",
        "hitokoto2-3": "あなたを、待っていますよ。",
        "hitokoto3_name": "ザトシ",
        "hitokoto3-1": "オレは、世界一になる男だ。",
        "hitokoto3-2": "ぜったい、なってやるーー。",
        "hitokoto3-3": "0",
        "hitokoto4_name": "クリス",
        "hitokoto4-1": "あたし、クリス。ペットのピカチーが、",
        "hitokoto4-2": "どこかに行っちゃったの。",
        "hitokoto4-3": "こまったわね、ぐすん。",
        "backcolor_red": "0",
        "backcolor_green": "255",
        "backcolor_blue": "255",
        "scorecolor_red": "0",
        "scorecolor_green": "0",
        "scorecolor_blue": "255",
        "grenade_red1": "255",
        "grenade_green1": "255",
        "grenade_blue1": "255",
        "grenade_red2": "255",
        "grenade_green2": "255",
        "grenade_blue2": "0",
        "mizunohadou_red": "0",
        "mizunohadou_green": "32",
        "mizunohadou_blue": "255",
        "firebar_red1": "255",
        "firebar_green1": "0",
        "firebar_blue1": "0",
        "firebar_red2": "255",
        "firebar_green2": "192",
        "firebar_blue2": "0",
        "moji_score": "SCORE",
        "moji_highscore": "HIGHSCORE",
        "moji_time": "TIME",
        "moji_jet": "JET",
        "moji_grenade": "GRENADE",
        "moji_left": "LEFT",
        "moji_size": "14",
        "filename_title": "title.gif",
        "filename_ending": "ending.gif",
        "filename_gameover": "gameover.gif",
        "filename_pattern": "pattern.gif",
        "SENDHIONLY": "false",
        "se_switch": "1",
        "se_filename": "1"
    },
    version: "fx16",
    metadata: {
        title: "サンプルゲーム1",
        author: "福田直人"
    }
});

interface IPropEditorComponent{
    mode: Mode;
    resource: ResourceData;
    media: MediaData;

    requestInit(): void;
    requestEditor(): void;
    requestResource(): void;
    requestTestplay(game: any, startStage: number): void;

    addFiles(resources: Array<ResourceWithoutId>): void;
}
export default class EditorComponent extends React.Component<IPropEditorComponent, {}>{
    constructor(props: IPropEditorComponent){
        super(props);
        this.handleTestplay = this.handleTestplay.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleFileAccept = this.handleFileAccept.bind(this);
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
                />
            </div>
            <div className={styles.content}>
                <div className={styles.editor}>
                    <MasaoEditorCore
                        ref="core"
                        filename_mapchip={filename_mapchip}
                        filename_pattern={filename_pattern}
                        defaultGame={defaultValue}
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
    // ファイルがドロップされた
    private handleFileAccept(files: Array<File>){
        this.props.addFiles(files.map(file=>({
            filename: file.name,
            blob: file,
        })));
    }
}
