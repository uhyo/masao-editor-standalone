import * as React from 'react';

import {
    connect,
} from '../store';

import TestplayComponent from '../component/testplay';

export default connect(
    ({testplay})=>({...testplay}),
    (dispatch)=>({
        onFinish(){
            dispatch({
                type: 'end-testplay',
            });
        },
    }),
)(TestplayComponent);
