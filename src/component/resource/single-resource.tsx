// ひとつのリソースを表示
import * as React from 'react';

import {
    Resource,
    SetResourceSizeAction,
} from '../../action/resource';

import {
    uis,
} from 'masao-editor-core';

const {
    Button,
} = uis;

import * as styles from '../css/resource.css';

interface IPropSingleResource{
    size: SetResourceSizeAction['size'];
    resource: Resource;

    requestDelete(): void;
}
interface IStateSingleResource{
    resourceURL: string | null;
}
export default class SingleResourceComponent extends React.Component<IPropSingleResource, IStateSingleResource>{
    constructor(props: IPropSingleResource){
        super(props);

        this.state = {
            resourceURL: this.getResourceURL(props),
        };
    }
    componentWillReceiveProps(nextProps: IPropSingleResource){
        if (this.state.resourceURL != null){
            URL.revokeObjectURL(this.state.resourceURL);
        }
        this.setState({
            resourceURL: this.getResourceURL(nextProps),
        });
    }
    componentWillUnmount(){
        if (this.state.resourceURL != null){
            URL.revokeObjectURL(this.state.resourceURL);
        }
    }
    private getResourceURL({resource: {blob}}: IPropSingleResource){
        if (/^image\//i.test(blob.type)){
            // 画像だ
            return URL.createObjectURL(blob);
        }else{
            return null;
        }
    }
    render(){
        const {
            size,
            resource: {
                filename,
                blob,
            },
            requestDelete,
        } = this.props;
        const {
            resourceURL,
        } = this.state;

        const imgClass = size === 'large' ? styles.singleResourceImgBig : styles.singleResourceImg;

        const media = size !== 'small' && resourceURL != null ?
            <div className={imgClass}>
                <img src={resourceURL} />
            </div> : null;
        return <div className={styles.singleResource}>
            <div className={styles.singleResourceName}>{filename}</div>
            <div className={styles.singleResourceControl}>
                <Button label="一覧から削除" onClick={requestDelete}/>
            </div>
            {media}
        </div>;
    }
};
