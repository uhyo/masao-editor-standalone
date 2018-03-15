import * as React from 'react';
import { connect } from '../store';
import { ResourceWithoutId, SetResourceSizeAction } from '../action/resource';

import ResourceComponent from '../component/resource/index';

export default connect(
  ({ resource: { status, size, resources }, media }) => ({
    status,
    size,
    resources,
    media,
  }),
  dispatch => ({
    requestLoad() {
      dispatch({
        type: 'request-load-resources',
      });
    },
    requestSizeChange(size: SetResourceSizeAction['size']) {
      dispatch({
        type: 'set-resource-size',
        size,
      });
    },
    addFiles(resources: Array<ResourceWithoutId>) {
      dispatch({
        type: 'add-resources',
        resources,
      });
    },
    deleteResource(id: number) {
      dispatch({
        type: 'delete-resource',
        id,
      });
    },
    requestSetMedia(param: string, key: number, name: string) {
      dispatch({
        type: 'set-media',
        param,
        name,
        key,
      });
    },
    requestUnsetMedia(param: string) {
      dispatch({
        type: 'unset-media',
        param,
      });
    },
  }),
)(ResourceComponent);
