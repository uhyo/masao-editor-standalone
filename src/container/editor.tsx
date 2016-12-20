import * as React from 'react';

import {
    Mode,
} from '../reducer/mode';
import {
    connect,
} from '../store';


import EditorComponent from '../component/editor';

export default connect(
    ({mode})=> ({mode}),
    (dispatch)=>({
        requestTestplay(game: any){
            dispatch({
                type: 'testplay',
                game,
            });
        },
    })
)(EditorComponent);
