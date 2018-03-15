import * as React from 'react';

import { param } from 'masao';

import { Resource } from '../../action/resource';
import { MediaData } from '../../reducer/media';

import ParamList from './param-list';

import * as styles from '../css/resource.css';

// メディア管理
interface IPropMedia {
  resources: Array<Resource>;
  media: MediaData;

  requestSetMedia(param: string, key: number, name: string): void;
  requestUnsetMedia(param: string): void;
}
interface IStateMedia {
  // 現在の編集対象
  current: string;
}

export default class MediaComponent extends React.Component<
  IPropMedia,
  IStateMedia
> {
  constructor(props: IPropMedia) {
    super(props);

    this.state = {
      current: 'filename_pattern',
    };

    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleResourceChange = this.handleResourceChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  render() {
    const { resources, media: { data } } = this.props;
    const { current } = this.state;

    const params = [
      'filename_pattern',
      'filename_mapchip',
      ...param.resourceKeys,
    ].map(key => {
      const p = param.data[key];
      return {
        key,
        disp: key,
        title: p && p.description,
      };
    });

    const recs = resources.map(({ id, filename }) => ({
      key: String(id),
      disp: filename,
    }));
    const recs2 = [
      {
        key: '',
        disp: 'なし',
      },
      ...recs,
    ];

    const cmd = data[current];

    const mediaKey = cmd == null ? '' : String(cmd.key);

    const nameInput =
      cmd == null ? null : (
        <input value={cmd.name} onChange={this.handleInput} />
      );

    return (
      <div className={styles.mediaWrapper}>
        <div className={styles.mediaItem}>
          <ParamList
            current={current}
            contents={params}
            requestChange={this.handleParamChange}
          />
        </div>
        <div className={styles.mediaItem}>
          <ParamList
            current={mediaKey}
            contents={recs2}
            requestChange={this.handleResourceChange}
          />
        </div>
        <div className={styles.mediaItem}>
          <p>
            <b>{current}</b>
          </p>
          {param.data[current] != null ? (
            <p>{param.data[current].description}</p>
          ) : null}
          {nameInput}
        </div>
      </div>
    );
  }
  private handleParamChange(next: string) {
    this.setState({
      current: next,
    });
  }
  private handleResourceChange(next: string) {
    const { requestSetMedia, requestUnsetMedia, resources } = this.props;
    const { current } = this.state;

    // 選ばれたリソース
    const key = Number(next);

    // 該当リソースを探す
    for (let { id, filename } of resources) {
      if (id === key) {
        requestSetMedia(current, key, filename);
        return;
      }
    }
    // そんなリソースがないなら無しで
    requestUnsetMedia(current);
  }
  private handleInput(e: React.SyntheticEvent<HTMLInputElement>) {
    const t = e.currentTarget;
    const { requestSetMedia, media: { data } } = this.props;
    const { current } = this.state;

    const dc = data[current];

    if (dc == null) {
      return;
    }

    requestSetMedia(current, dc.key, t.value);
  }
}
