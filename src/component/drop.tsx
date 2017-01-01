import * as React from 'react';

import * as styles from './css/drop.css';
// ファイルドロップを受け入れるComponent

interface IPropDrop{
    requestFileAccept(files: Array<File>): void;
}
interface IStateDrop{
    // 受付ポイントが展開しているか
    open: boolean;
}
export default class DropComponent extends React.Component<IPropDrop, IStateDrop>{
    constructor(props: IPropDrop){
        super(props);

        this.state = {
            open: false,
        };

        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }
    componentDidMount(){
        document.documentElement.addEventListener('dragenter', this.handleDragEnter, false);
    }
    componentWillUnmount(){
        document.documentElement.removeEventListener('dragenter', this.handleDragEnter, false);
    }
    render(){
        const {
            open,
        } = this.state;
        if (!open){
            return <div/>;
        }
        return <div className={styles.wrapper}>
            <div className={styles.message}>
                ファイルをドロップできます
            </div>
            <div className={styles.mask} ref="mask" onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}/>
        </div>;
    }
    private handleDragEnter(e: DragEvent){
        if (this.state.open){
            return;
        }
        this.setState({
            open: true,
        });
        e.dataTransfer.effectAllowed = 'copy';
    }
    private handleDragOver(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
    }
    private handleDragLeave(_e: React.DragEvent<HTMLDivElement>){
        if (!this.state.open){
            return;
        }
        this.setState({
            open: false,
        });
    }
    private handleDrop(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        this.setState({
            open: false,
        });
        const files = Array.from(e.dataTransfer.files);

        if (files.length > 0){
            this.props.requestFileAccept(files);
        }
    }
}
