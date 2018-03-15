import * as React from 'react';
import { Provider } from 'react-redux';

import store from '../store';

import EditorContainer from '../container/editor';

export default class MasaoEditor extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <EditorContainer />
      </Provider>
    );
  }
}
