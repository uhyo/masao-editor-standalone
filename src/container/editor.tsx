import * as React from 'react';
import {
    connect,
} from 'react-redux';


import EditorComponent from '../component/editor';

class MasaoEditor extends React.Component<{
    mode: string;
}, {}>{
    render(){
        return <EditorComponent mode={this.props.mode}/>;
    }
}

export default connect(({mode})=> ({mode}))(MasaoEditor);
