import * as React from 'react';

import * as styles from './css/key.css';

import {
    Command,
    commandNames,
} from 'masao-editor-core';

interface IPropKey{
    binding: Record<string, Command>;
}
interface IStateKey{
}

export default class KeyScreenComponent extends React.Component<IPropKey, IStateKey>{
    render(){
        const {
            binding,
        } = this.props;

        return <div className={styles.wrapper}>
            <h1>キー設定</h1>
            <p>ショートカットキーの一覧を表示しています。現在はこれを編集することはできません。</p>
            <table>
                <thead>
                    <tr><th>キー</th><th>動作</th></tr>
                </thead>
                <tbody>{
                    Object.keys(binding).map(key=>{
                        return <tr key={key}>
                            <td><kbd className={styles.key}>{key}</kbd></td>
                            <td>{commandNames[binding[key]]}</td>
                        </tr>;
                    })
                }</tbody>
            </table>
        </div>;
    }
}
