// canvas masao player.
import * as React from 'react';

import randomString from '../../util/random-string';

import {
    MediaData,
} from '../../reducer/media';

import {
    acceptVersion,
} from './version';
import {
    addResource,
} from './param';

import * as styles from './css.css';

interface IPropGame{
    game: any;
    media: MediaData;
}

export default class Game extends React.Component<IPropGame, {}>{
    private gameid: string = '';
    private game: any;
    private scriptElement: HTMLElement | null = null;
    shouldComponentUpdate(nextProps: IPropGame){
        return nextProps.game !== this.props.game;
    }
    componentDidMount(){
        this.setGame();
    }
    componentWillUnmount(){
        this.unsetGame();
    }
    componentWillUpdate(){
        this.unsetGame();
    }
    componentDidUpdate(){
        this.setGame();
    }
    render(){
        const gameid = this.gameid = randomString();
        return <div className={styles.gameContainer} id={gameid} />;
    }

    // gameを設置する
    private setGame(){
        const {
            gameid,
            props: {
                game,
                media,
            },
        } = this;

        const version = acceptVersion(game.version);

        // グローバル変数を汚染
        const glb_game_name = `_masao_editor_game_${gameid}`;

        // スクリプトの断片
        const ctr = version === '2.8' ? 'CanvasMasao_v28' : 'CanvasMasao';
        const ext = version === 'kani2' ? 'CanvasMasao.MasaoKani2' : '';
        const ujc = game.script ? `window['userJSCallback'] || null` : 'null';

        const params2 = {
            ...addResource('testplay', game.params, media),

            // TODO
            fx_bgm_switch: '2',
            se_switch: '2',
        };

        const params = JSON.stringify(params2);

        const script = `
${game.script || ''}
window['${glb_game_name}'] = new ${ctr}.Game(${params}, '${gameid}', {
    extensions: [${ext}],
    userJSCallback: ${ujc},
});`;
        this.scriptElement = document.createElement('script');
        this.scriptElement.textContent = script;
        document.body.appendChild(this.scriptElement);
    }
    // gameを消す
    private unsetGame(){
            const {
            gameid,
            scriptElement,
        } = this;
        if (scriptElement != null){
            document.body.removeChild(scriptElement);
        }
        const glb_game_name = `_masao_editor_game_${gameid}`;
        const w: any = window;
        const game: any = w[glb_game_name];
        if (game != null){
            game.kill();
        }
        delete w[glb_game_name];
    }
}
