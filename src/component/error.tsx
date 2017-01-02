import * as React from 'react';

import {
    uis,
} from 'masao-editor-core';

const {
    Button,
} = uis;

import * as styles from './css/error.css';
// エラー表示

interface IPropError{
    message: string;
    requestClose(): void;
}
export default ({message, requestClose}: IPropError)=>{
    return <div className={styles.wrapper}>
        <div className={styles.wrapper2}>
            <div className={styles.content}>
                <p>{message}</p>
                <div className={styles.control}><Button label="閉じる" onClick={requestClose} /></div>
            </div>
        </div>
    </div>
};

