import * as React from 'react';

import { connect } from '../store';

import TestplayComponent from '../component/testplay';

export default connect(({ testplay, media }) => ({
  ...testplay,
  media,
}))(TestplayComponent);
