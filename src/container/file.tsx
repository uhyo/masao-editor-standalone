import * as React from 'react';
import { connect } from '../store';

import { BrowserFile } from '../action/file';

import FileComponent from '../component/file/index';

export default connect(
  ({ file }) => ({ file }),
  dispatch => ({
    requestLoad() {
      dispatch({
        type: 'request-load-files',
      });
    },
    requestFileOpen(file: BrowserFile) {
      // ファイルを開く
      dispatch({
        type: 'load-game',
        id: undefined,
        game: file.data,
      });
      // メイン画面に戻る
      dispatch({
        type: 'main-screen',
      });
    },
  }),
)(FileComponent);
