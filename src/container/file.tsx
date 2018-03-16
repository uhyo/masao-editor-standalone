import * as React from 'react';
import { connect } from '../store';

import { BrowserFile } from '../action/file';
import { MasaoJSONFormat } from '../game/format';

import FileComponent from '../component/file/index';

export default connect(
  ({ file }) => ({ file }),
  dispatch => ({
    requestLoad() {
      dispatch({
        type: 'request-load-files',
      });
    },
    requestFilePreview(game: MasaoJSONFormat) {
      // プレビューのときは開くけどスクリーンは移動しない
      dispatch({
        type: 'load-game',
        id: undefined,
        game,
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
    requestFileDelete(file: BrowserFile) {
      // ファイルを削除
      dispatch({
        type: 'file-delete',
        file,
      });
    },
  }),
)(FileComponent);
