import * as React from 'react';

import MasaoEditorCore from 'masao-editor-core';

export default class EditorComponent extends React.Component<{}, {}>{
    render(){
        // TODO
        console.log(require('masao-editor-core'));
        return <MasaoEditorCore
            filename_mapchip="mapchip.gif"
            filename_pattern="pattern.gif"
        />;
    }
}
