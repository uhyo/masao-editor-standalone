import * as React from 'react';

import {
    connect,
} from '../store';


import EditorComponent from '../component/editor';

export default connect(
    ({
        mode,
        media,
    })=> ({
        mode,
        media,
    }),
    (dispatch)=>({
        requestEditor(){
            dispatch({
                type: 'main-screen',
            });
        },
        requestResource(){
            dispatch({
                type: 'resource-screen',
            });
        },
        requestTestplay(game: any, startStage: number){
            dispatch({
                type: 'testplay',
                startStage,
                game,
            });
        },
    })
)(EditorComponent);
