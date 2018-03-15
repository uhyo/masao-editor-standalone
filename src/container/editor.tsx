import * as React from 'react';

import { connect } from '../store';

import { ResourceWithoutId } from '../action/resource';
import { MasaoJSONFormat } from '../game/format';

import EditorComponent from '../component/editor';
import * as masao from 'masao';

export default connect(
  ({ error, mode, resource, media, game }) => ({
    error,
    mode,
    resource,
    media,
    game,
  }),
  dispatch => ({
    requestInit() {
      dispatch({
        type: 'load-fingerprint',
      });
    },
    requestEditor() {
      dispatch({
        type: 'main-screen',
      });
    },
    requestResource() {
      dispatch({
        type: 'resource-screen',
      });
    },
    requestFile() {
      dispatch({
        type: 'file-screen',
      });
    },
    requestTestplay(game: any, startStage: number) {
      dispatch({
        type: 'testplay',
        startStage,
        game,
      });
    },
    requestKey() {
      dispatch({
        type: 'key-screen',
      });
    },
    addFiles(resources: Array<ResourceWithoutId>) {
      dispatch({
        type: 'add-resources',
        resources,
      });
      dispatch({
        type: 'resource-screen',
      });
    },
    requestSaveInBrowser(id: string, game: MasaoJSONFormat) {
      dispatch({
        type: 'file-save-in-browser',
        id,
        game,
      });
    },
    requestLoadGame(game: MasaoJSONFormat) {
      dispatch({
        type: 'load-game',
        game,
      });
      dispatch({
        type: 'main-screen',
      });
    },
    requestError(message: string) {
      dispatch({
        type: 'error',
        message,
      });
    },
    requestCloseError() {
      dispatch({
        type: 'clear-error',
      });
    },
  }),
)(EditorComponent);
