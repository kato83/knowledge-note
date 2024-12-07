/**
 * 閲覧しているユーザーがログイン済みかチェックするメソッド
 * @param {(any) => any} callback ログイン済みと確認ができた後に実行する処理
 * @returns 引数 callback で渡した関数の実行結果
 */
export const userCheck = (callback) => async () => {
  return await fetch('/api/v1/user/me', {
    headers: { 'content-type': 'application/json' },
  })
    .then(res => {
      if (res.ok) {
        return callback();
      }
      else {
        location.href = '/';
      }
    });
};
