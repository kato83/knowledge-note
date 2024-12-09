/**
 * 全てのクッキーを取得する
 * @returns cookieのセット
 */
export const getCookieMap = () => new Map(document.cookie
  .split(';')
  .map(data => data.split('=')
    .map(data => decodeURIComponent(data.trim()))));
