/**
 * "/foo/bar" のようなパス文字列を ['foo', 'bar'] の配列形式に変換する
 * @param {string} str パス文字列
 * @returns スラッシュ記号単位で分割した配列
 */
const pathParse = (str) => str
  .split('/')
  .slice(1)
  .filter(Boolean);

let _routes = null;
let _on = null;

/**
 * URLに応じて呼び出す関数を切り替えるルーター関数
 * @param { { path: string, fn: Function }[] } routes パスとパスにマッチした際に実行する関数をペアにしたオブジェクトリテラル
 * @param { { onError: (error: Error) => any, onNotFound: Function, onBefore: ({ path: string, fn: Function }) => any, onAfter: (any) => any } } on 
 * - onError: エラー発生時の処理
 * - onNotFound: どのパスにもマッチしなかった際の処理
 * - onBefore: 前処理
 * - onAfter: 後処理
 */
export const router = (routes, on) => {
  _routes = routes;
  _on = on;
  try {
    const { pathname } = location;
    /** @type { string[] } 現在アクセスしているURLを配列に加工したもの */
    const dir = pathParse(pathname);
    /** パスの規則にマッチしているルートのオブジェクトリテラル */
    const target = routes
      .filter(route => pathParse(route.path).length === dir.length)
      .map(route => {
        if (!'fn' in route) throw new Error('パスにマッチした際に実行する関数が定義されていません');

        /** 表示優先度 */
        let displayPriority = 0;
        /** @type { Map<string, string> } パスパラメーター（":"ではじまるもの）をセットするマップ */
        const pathParameterMap = new Map();
        /** @type { string[] } パスを配列に変換したもの */
        const path = pathParse(route.path);

        // トップページ（/）の場合の処理
        if (path.length === 0 && dir.length === 0) {
          displayPriority = 1;
        }

        for (let index = 0; index < dir.length; index++) {
          if (path[index].length > 1 && path[index].startsWith(':')) {
            displayPriority++;
            pathParameterMap.set(path[index].slice(1), dir[index]);
          }
          else if (dir[index] === path[index]) {
            displayPriority++;
          }
          else {
            displayPriority = 0;
            break;
          }
        }
        return { ...route, displayPriority, fn: route.fn.bind(route.fn, Object.fromEntries(pathParameterMap)) };
      })
      .filter(({ displayPriority }) => displayPriority)
      .sort(({ priority: a }, { priority: b }) => a < b ? 1 : -1)
      .at(0);

    // 前処理
    if (typeof on.onBefore === 'function') on.onBefore(target);

    // 本処理
    console.debug('Router target: %o', target);
    let fn;
    if (target) fn = target.fn();
    else if (typeof on.onNotFound === 'function') fn = on.onNotFound();
    else console.error('Target route not found.');

    // 後処理
    if (typeof on.onAfter === 'function') on.onAfter(fn);
  } catch (e) {
    if (typeof on.onError === 'function') on.onError(e);
    else console.error(e);
  }
};

export const navigate = (url) => {
  document.querySelector('#app').innerHTML = '';
  history.pushState({}, '', url);
  router(_routes, _on);
};
