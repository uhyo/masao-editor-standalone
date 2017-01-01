// html出力
import {
    acceptVersion,
} from './version';
import {
    param,
} from 'masao';

export function gameToHTML(game: any): string{
    const v = acceptVersion(game.version);
    const cvs = ['CanvasMasao.js'];
    if (v === 'kani2'){
        cvs.push('MasaoKani2.js');
    }

    const params = param.cutDefaults(game.params);

    return htmlTemplate(cvs, params);
}


function htmlTemplate(scripts: Array<string>, params: Record<string, string>, userScript?: string): string{
    const scripttags = scripts.map(src=> `<script src="${encodeURIComponent(src)}"></script>`).join('\n');
    const userJSCallback = 'string' === typeof userScript ? `userJSCallback: 'undefined' !== typeof userJSCallback ? userJSCallback : null,` : '';
    const gamescript = `${userScript ? userScript+';' : ''}new CanvasMasao.Game(${jsFriendlyJSONStringify(params, 2)}, null, {
    ${userJSCallback}
});`;
    return `<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>まさお コンストラクション  サンプルゲーム</title>
${scripttags}
</head>
<body bgcolor="silver">
<center>
<script type="text/javascript">
${gamescript}
</script>
</center>

<br>
<br>
<hr>
<br>


<h2>キーボード操作</h2>

<dl>
<dt>（←），（４）
<dd>左へ歩く。素早く２回押すと走る。
<dt>（→），（６）
<dd>右へ歩く。素早く２回押すと走る。
<dt>（スペース），（Ｚ）
<dd>ジャンプする。
<dt>（Ｔ）
<dd>タイトル画面に戻る。
</dl>

ゲーム画面をマウスでクリックすると、ゲーム開始です。<p>


<br>
<hr>
<br>


<h2>遊び方</h2>

ゲーム画面をマウスでクリックすると、ゲーム開始です。赤い人は正義の味方で、主人公です。カーソルキーまたはテンキーで、左右に動きます。素早く２回押すと、走ります。スペースキーで、ジャンプします。彼の趣味は、お金を拾う事です。それと、亀を踏んづける事です。彼の夢は、マップの右の方にある星を取る事です。<p>


<br>
<hr>
<br>


<a href = "http://www.t3.rim.or.jp/~naoto/j_con/index.html">サポートページ</a>へ移動する。<p>
</body>
</html>`;
}

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
function jsFriendlyJSONStringify(s: any, space: any) {
    return JSON.stringify(s, null, space).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
}
