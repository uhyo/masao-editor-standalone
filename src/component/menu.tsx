import * as React from 'react';

import {
    Mode,
} from '../reducer/mode';

import * as styles from './css/menu.css';

interface IPropMenu{
    mode: Mode;
    requestEditor(): void;
    requestTestplay(): void;
    requestResource(): void;

    requestNewGame(): void;
    requestSave(): void;
    requestHTML(): void;
}

export default class MenuComponent extends React.Component<IPropMenu, {}>{
    render(){
        const {
            mode,
            requestEditor,
            requestTestplay,
            requestResource,

            requestNewGame,
            requestSave,
            requestHTML,
        } = this.props;
        const cls = (m: Mode)=> (m === mode ? styles.active : styles.button);
        return <div className={styles.wrapper}>
            <div onClick={requestEditor} className={cls('main')}>エディタ</div>
            <div onClick={requestTestplay} className={cls('testplay')}>テストプレイ</div>
            <div onClick={requestResource} className={cls('resource')}>リソース</div>
            <div className={styles.separator} />
            <div onClick={requestNewGame} className={styles.button}>新規</div>
            <div onClick={requestSave} className={styles.button}>JSON保存</div>
            <div onClick={requestHTML} className={styles.button}>HTML出力</div>
        </div>;
    }
}

