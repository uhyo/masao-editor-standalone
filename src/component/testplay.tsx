import * as React from 'react';
import {uis} from 'masao-editor-core';


import {
    TestplayData,
} from '../reducer/testplay';
import {
    MediaData,
} from '../reducer/media';

import Game from './game';

import * as styles from './css/testplay.css';
 
interface IPropTestplay extends TestplayData{
    media: MediaData;
}

export default class TestplayComponent extends React.Component<IPropTestplay, {}>{
    render(){
        const {
            startStage,
            game,
            media,
        } = this.props;
        const {
            Button,
        } = uis;

        // 開始ステージをアレする
        const game2 = {
            ...game,
            params: {
                ...(game.params),
                stage_kaishi: String(startStage),
            },
        };
        return <div className={styles.wrapper}>
            <div className={styles.gameContainer}>
                <Game game={game2} media={media}/>
            </div>
        </div>;
    }
}
