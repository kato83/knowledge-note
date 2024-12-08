import mustache from 'mustache';
import html from '../templates/login.html?raw';
import { navigate } from '../utils/router';
import { home } from './home';

export const login = () => {
  const app = document.querySelector('#app');
  app.innerHTML = mustache.render(html);

  document
    .querySelector('#login-form')
    .addEventListener('submit', e => {
      e.preventDefault();

      /** @type {HTMLButtonElement} */
      const button = e.target.querySelector('button[type="submit"]');
      button.disabled = true;
      const data = Object.fromEntries(new FormData(e.target).entries());
      fetch('/api/v1/login', {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
        method: 'POST',
      })
        .then(res =>
          new Promise((resolve, reject) => res.ok ? resolve(res.json()) : reject(res.text())))
        .then(json => {
          navigate('/');
          // location.href = '/';
        })
        .catch(err => console.error(err))
        .finally(() => {
          button.disabled = false;
        });
    });
};