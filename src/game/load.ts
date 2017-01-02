import * as masao from 'masao';

// Fileからゲームを取得するかも
export function loadFileAsGame(file: File): Promise<any | null>{
    return new Promise<any | null>((resolve)=>{
        if (file.type === 'application/json' || /\.json$/i.test(file.name)){
            // JSONっぽい
            resolve(loadText(file).then(loadJSON).then(game=>{
                if (game == null){
                    return Promise.reject(new Error(`${file.name}から正男を読み込めませんでした。`));
                }else{
                    return game;
                }
            }));
            return;
        }
        if (file.type === 'text/html' || /\.html$/i.test(file.name)){
            resolve(loadText(file).then(loadHTML).then(game=>{
                if (game == null){
                    return Promise.reject(new Error(`${file.name}から正男を読み込めませんでした。`));
                }else{
                    return game;
                }
            }));
            return;
        }
        resolve(null);
    });
}

// Fileをstringとして読む
function loadText(file: File): Promise<string>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();

        reader.onerror = reject;
        reader.onload = ()=>{
            resolve(reader.result);
        };
        reader.readAsText(file);
    });
}

// JSONを解釈
function loadJSON(data: string): Promise<any>{
    return new Promise((resolve)=>{
        const obj = JSON.parse(data);
        const fmt = masao.format.load(obj);

        resolve(fmt);
    });
}

// HTMLを解釈
function loadHTML(data: string): Promise<any>{
    return new Promise<any>((resolve, _reject)=>{
        // DOMParser
        const parser = new DOMParser();

        const htmldoc = parser.parseFromString(data, 'text/html');

        // 正男を探す(まずはapplet/object)
        const applets = Array.from<HTMLElement>(htmldoc.querySelectorAll('applet, object') as any);

        for (let a of applets){
            if (a.tagName === 'APPLET'){
                // applet!
                const code = a.getAttribute('code') || '';
                const archive = a.getAttribute('archive') || '';
                const version = getVersion(code, archive);
                if (version == null){
                    continue;
                }
                const ps = Array.from<HTMLParamElement>(a.getElementsByTagName('param'));
                const params: Record<string, string> = {};
                for (let p of ps){
                    params[p.name] = p.value;
                }
                resolve(masao.format.make({
                    params,
                    version,
                }));
                return;
            }else if (a.tagName === 'OBJECT'){
                // object!
                const type = a.getAttribute('type') || '';
                if (/^application\/x-java-applet$/i.test(type)){
                    // 正男かも
                    const ps = Array.from<HTMLParamElement>(a.getElementsByTagName('param'));
                    const params: Record<string, string> = {};

                    let code;
                    let archive;
                    for (let p of ps){
                        if (/^classid$/i.test(p.name)){
                            const re = p.value.match(/^java:(.+)$/);
                            if (re == null){
                                continue;
                            }
                            code = re[1];
                        }else if (/^archive$/i.test(p.name)){
                            archive = p.value;
                        }else{
                            params[p.name] = p.value;
                        }
                    }
                    if (code == null || archive == null){
                        continue;
                    }
                    const version = getVersion(code, archive);
                    if (version == null){
                        continue;
                    }
                    resolve(masao.format.make({
                        params,
                        version,
                    }));
                    return;
                }
            }
        }

        // canvas正男を探す
        const scripts = Array.from<HTMLScriptElement>(htmldoc.getElementsByTagName('script'));
        let version = 'fx16';
        let params = null;
        for (let s of scripts){
            if (s.type !== 'text/javascript' && s.type !== 'application/javascript' && s.type){
                continue;
            }
            // JavaScriptっぽい
            if (s.src){
                if (/v28/i.test(s.src)){
                    version = '2.8';
                }
                if (/MasaoKani/i.test(s.src)){
                    version = 'kani2';
                }
                continue;
            }
            const text = s.text;
            const p1 = findCanvasParams(text);
            if (p1 == null){
                // なかった
                continue;
            }
            params = p1;
        }
        if (params != null){
            // JavaScriptからcanvas正男を発見！！！！！１１１！１１１１
            resolve(masao.format.make({
                params,
                version,
            }));
            return;
        }

        resolve(null);
    });
}

// JavaScriptからcanvas正男を抽出（てきとう）
function findCanvasParams(text: string): Record<string, string> | null{
    let params: Record<string, string> | null = null;

    let index = 0, len = text.length;

    outerloop: while (index < len){
        const pos = text.indexOf('Game({', index);
        if (pos < 0){
            // もうない
            return null;
        }
        params = {};

        index = pos + 6;
        // パース
        let state = 0;
        let key = null;
        let pool = '';
        for (; index < len; index++){
            const char = text[index];
            if((state===0 || state===3 || state===4 || state===7) && (char===' ' || char==='\t' || char==='\r' || char==='\n')){
                // 無視できる空白
                continue;
            }
            if(state===0 && char==='}'){
                //終了
                return params;
            }
            if(state===0 || state===4){
                //文字列を探してる
                if(char==="'"){
                    pool = '';
                    state += 1;
                }else if(char==='"'){
                    pool = '';
                    state += 2;
                }else{
                    //parse error
                    continue outerloop;
                }
            }else if(state===1 || state===5){
                //'の中の文字列
                if(char==="'"){
                    state += 2;
                }else{
                    pool += char;
                }
            }else if(state===2 || state===6){
                //"の中の文字列
                if(char==='"'){
                    state += 1;
                }else{
                    pool += char;
                }
            }else if(state===3){
                //:を待っている
                if(char===':'){
                    state = 4;
                    key = pool;
                }else{
                    continue outerloop;
                }
            }else if(state===7){
                //終わりかも
                if (key == null){
                    continue outerloop;
                }
                if(char===','){
                    params[key] = pool;
                    state = 0;
                }else if(char==='}'){
                    //おわりだ！！！
                    params[key] = pool;
                    return params;
                }else{
                    continue outerloop;
                }
            }
        }
    }
    return null;
}

// code, archiveからversionを推定
function getVersion(code: string, archive: string): '2.8' | 'fx16' | 'kani2' | null{
    if (/^(?:MasaoConstruction|MasaoJSS)(?:\.class)?$/i.test(code)){
        // 正男っぽい
        // バージョン判定
        if (/\.zip$/i.test(archive)){
            return '2.8';
        }else{
            return 'fx16';
        }
    }else if(/^MasaoKani2?(?:\.class)$/i.test(code)){
        return 'kani2';
    }
    return null;
}
