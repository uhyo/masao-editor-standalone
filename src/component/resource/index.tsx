import * as React from 'react';
import {
    param,
} from 'masao';

import {
    uis,
} from 'masao-editor-core';

const {
    Button,
    Select,
} = uis;

import {
    ResourceData,
} from '../../reducer/resource';
import {
    MediaData,
} from '../../reducer/media';
import {
    ResourceWithoutId,
    Resource,
    SetResourceSizeAction,
} from '../../action/resource';

import * as styles from '../css/resource.css';
import SingleResourceComponent from './single-resource';
import MediaComponent from './media';
import fileUpload from './file-upload';

// Resource管理パネル
interface IPropResource extends ResourceData{
    loading: boolean;
    size: SetResourceSizeAction['size'];
    resources: Array<Resource>;

    media: MediaData;

    requestLoad(): void;
    requestSizeChange(size: SetResourceSizeAction['size']): void;
    addFiles(files: Array<ResourceWithoutId>): void;
    deleteResource(id: number): void;

    requestSetMedia(param: string, key: number, name: string): void;
    requestUnsetMedia(param: string): void;
}

export default class ResourceComponent extends React.Component<IPropResource, {}>{
    constructor(props: IPropResource){
        super(props);

        this.handleAddFile = this.handleAddFile.bind(this);
    }
    componentDidMount(){
        this.props.requestLoad();
    }
    render(){
        const {
            loading,
            size,
            resources,
            media,

            requestSizeChange,
            deleteResource,

            requestSetMedia,
            requestUnsetMedia,
        } = this.props;

        const resourceChildClass = size == 'large' ? styles.resourceChildBig : styles.resourceChild;

        const loadingpanel = loading ? <p>Loading...</p> : null;
        const resourcepanel = !loading ? <div className={styles.resourceList}>{
            resources.map(resource=>{
                const requestDelete = ()=>{
                    deleteResource(resource.id);
                };
                return <div key={resource.id} className={resourceChildClass}>
                    <SingleResourceComponent size={size} resource={resource} requestDelete={requestDelete}/>
                </div>;
            })
        }</div> : null;

        return <div className={styles.wrapper}>
            <div className={styles.desc}>
                <h1>リソース選択</h1>
                <p>追加したリソースの中から適用するものを選択してください。</p>
                <MediaComponent resources={resources} media={media} requestSetMedia={requestSetMedia} requestUnsetMedia={requestUnsetMedia}/>
                <h1>リソース管理</h1>
                <p>リソースは全てブラウザ上に保存されています。</p>
                <div>
                    <Button label="ファイルを追加" onClick={this.handleAddFile}/>
                    <Select contents={[
                        {
                            key: 'small',
                            value: '小',
                        }, {
                            key: 'middle',
                            value: '中',
                        }, {
                            key: 'large',
                            value: '大',
                        }
                    ]} valueLink={{
                        value: size,
                        requestChange: requestSizeChange,
                    }}/>
                </div>
            </div>
            {loadingpanel}
            {resourcepanel}
        </div>
    }
    handleAddFile(){
        // ファイルを追加ボタンが押されたからダイアログを出す
        fileUpload().then(files=>{
            const data = files.map(file=>({
                filename: file.name,
                blob: file,
            }));
            this.props.addFiles(data);
        });
    }
}
