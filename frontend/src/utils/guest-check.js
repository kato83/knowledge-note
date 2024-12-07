/**
 * 閲覧しているユーザーがゲストユーザー（未ログイン）かチェックするメソッド
 * @param {(any) => any} callback まだ未ログインでゲスト状態だと確認ができた後に実行する処理
 * @returns 引数 callback で渡した関数の実行結果
 */
export const guestCheck = (callback) => async () => {
  return await fetch('/api/v1/user/me', {
    headers: { 'content-type': 'application/json' },
  })
    .then(res => {
      if (!res.ok) {
        return callback();
      }
      else {
        location.href = '/';
      }
    });
};
