import * as React from 'react';

import * as styles from './css/about.css';

import { Command, commandNames } from 'masao-editor-core';

// load logo file.
declare const require: any;
const logoImg = require('../../static/meme-logo.png');

export default class AboutScreenComponent extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className={styles.wrapper}>
        <h1>エディタについて</h1>
        <p className={styles.imgP}>
          <img src={logoImg} alt="MEME ロゴ" />
        </p>
        <p className={styles.name}>
          <b>MEME</b>: the Most Essential Masao Editor
        </p>
        <hr />
        <p>
          開発者：うひょ（
          <a target="_blank" href="https://uhyohyo.net/">
            ウェブサイト
          </a>
          ，
          <a target="_blank" href="https://twitter.com/uhyo_">
            Twitter
          </a>
          ）
        </p>
        <p>
          MEME 正男エディタはオープンソースソフトウェアです。
          <a
            target="_blank"
            href="https://github.com/uhyo/masao-editor-standalone"
          >
            GitHub
          </a>
        </p>
      </div>
    );
  }
}
