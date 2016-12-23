// canvas masao player.
import * as React from 'react';

import randomString from '../../util/random-string';

import {
    acceptVersion,
} from './version';

import * as styles from './css.css';

interface IPropGame{
    game: any;
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
            ...(game.params),

            // TODO
            fx_bgm_switch: '2',
            se_switch: '2',
            filename_chizu: 'chizu.gif',
            filename_ending: 'ending.gif',
            filename_gameover: 'gameover.gif',
            filename_haikei: 'haikei.gif',
            filename_haikei2: 'haikei.gif',
            filename_haikei3: 'haikei.gif',
            filename_haikei4: 'haikei.gif',
            filename_mapchip: 'mapchip.gif',
            filename_pattern: 'pattern.gif',
            filename_title: 'title.gif',
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
