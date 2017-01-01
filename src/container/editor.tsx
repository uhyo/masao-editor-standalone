import * as React from 'react';

import {
    connect,
} from '../store';

import {
    ResourceWithoutId,
} from '../action/resource';

import EditorComponent from '../component/editor';

export default connect(
    ({
        mode,
        resource,
        media,
    })=> ({
        mode,
        resource,
        media,
    }),
    (dispatch)=>({
        requestInit(){
            dispatch({
                type: 'load-fingerprint',
            });
        },
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
        addFiles(resources: Array<ResourceWithoutId>){
            dispatch({
                type: 'add-resources',
                resources,
            });
        },
    })
)(EditorComponent);
