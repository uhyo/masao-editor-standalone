import * as React from 'react';
import * as styles from './css/editor.css';

import { SavedType } from '../action/game';

/**
 * Status bar.
 */
export interface IPropStatusBar {
  /**
   * Whether current stage is updated.
   */
  saving: SavedType;
  /**
   * title of current stage.
   */
  title: string;
}

/**
 * Status bar component.
 */
export class StatusBar extends React.PureComponent<IPropStatusBar, {}> {
  public render() {
    const { saving, title } = this.props;
    const statusStr =
      saving === 'no'
        ? `未保存 - ${title}`
        : saving === 'saved' ? `保存済 - ${title}` : `*未保存 - ${title}`;

    return <div className={styles.statusBar}>{statusStr}</div>;
  }
}
