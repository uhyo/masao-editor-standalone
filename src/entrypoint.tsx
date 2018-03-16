import * as React from 'react';
import * as ReactDOM from 'react-dom';

import store from './store';

import MasaoEditor from './container/index';
const id = 'app';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const apparea = document.getElementById(id);

    // initial logic
    store.dispatch({
      type: 'init',
    });

    const root = <MasaoEditor />;

    ReactDOM.render(root, apparea);
  },
  false,
);
