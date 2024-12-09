import mustache from 'mustache';
// Viteのルールとして、インポートする対象のファイルをそのまま取得するためには相対パスの末尾に"?raw"を付与する必要がある
// この場合、テンプレートのHTMLファイルをそのまま取得したいので"?raw"を末尾に付与している
// 参照: https://ja.vite.dev/guide/assets.html#importing-asset-as-string
import html from '../templates/mypage.html?raw';

export const mypage = () => {
  const app = document.querySelector('#app');
  app.innerHTML = mustache.render(html, { });

  const username = document.querySelector('input[name="username"]');
  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="new-password"]');

  document.addEventListener('submit', e => {
    // 送信処理を中断して代わりに後続の処理を実行
    e.preventDefault();
    const data = {};
    if (username) data.username = username.value;
    if (email) data.email = email.value;
    if (password) data.password = password.value;

    fetch('/api/v1/user-update', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        document.querySelector('form strong').textContent = res.message;
      });
  });
  
  
};
