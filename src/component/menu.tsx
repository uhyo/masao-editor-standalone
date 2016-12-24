import * as React from 'react';

import {
    Mode,
} from '../reducer/mode';

import * as styles from './css/menu.css';

interface IPropMenu{
    mode: Mode;
    requestEditor(): void;
    requestTestplay(): void;
    requestSave(): void;
}

export default class MenuComponent extends React.Component<IPropMenu, {}>{
    render(){
        const {
            mode,
            requestEditor,
            requestTestplay,
            requestSave,
        } = this.props;
        const cls = (m: Mode)=> (m === mode ? styles.active : styles.button);
        return <div className={styles.wrapper}>
            <div onClick={requestEditor} className={cls('main')}>エディタ</div>
            <div onClick={requestTestplay} className={cls('testplay')}>テストプレイ</div>
            <div onClick={requestSave} className={styles.button}>保存</div>
        </div>;
    }
}

