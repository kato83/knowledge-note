import { findRoute, navigate } from "../utils/router";

/**
 * アプリケーションで最初に実行する関数
 */
export const bootstrap = () => {
  navigate(location.pathname);

  window.addEventListener('popstate', () => navigate(location.pathname));
  window.addEventListener('click', (e) => {
    const target = e.target.tagName === 'A' ? e.target : e.target.closest('a');
    // <a> タグ以外はスルーする
    if (target?.tagName !== 'A') return;

    // 別サイトの場合はスルーする
    const href = target.getAttribute('href');
    const url = new URL(href, location.origin);
    if (location.origin !== url.origin) return;

    // フロントエンド側のJSのrouteで定義しているパスかチェックして
    // 定義されていない、存在しないなら後続処理をスキップする
    if (!findRoute(href)) return;

    e.preventDefault();
    navigate(href);
  });
};
