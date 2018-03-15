import * as React from 'react';
import { connect } from '../store';

import FileComponent from '../component/file/index';

export default connect(
  ({ file }) => ({ file }),
  dispatch => ({
    requestLoad() {
      dispatch({
        type: 'request-load-files',
      });
    },
  }),
)(FileComponent);
