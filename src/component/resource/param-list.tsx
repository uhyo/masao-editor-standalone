// resourceなparamのリスト
import * as React from 'react';

import * as styles from '../css/resource.css';

interface IPropParamlist{
    current: string;
    contents: Array<{
        key: string;
        disp: string;
        title?: string;
    }>;
    requestChange(next: string): void;
}

export default ({
    current,
    contents,
    requestChange,
}: IPropParamlist)=>{
    return <div className={styles.paramList}>
        <div className={styles.listWrapper}>{
            contents.map(({key, disp, title}, i)=>{
                const cl = key === current ? styles.listContentCurrent : styles.listContent;
                const f = ()=>{
                    requestChange(key);
                };
                return <div key={`${key}-${i}`} className={cl} title={title} onClick={f}>
                    {disp}
                </div>;
            })
        }</div>
    </div>
};
