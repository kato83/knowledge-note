import { router } from './utils/router';
import { login } from './pages/login';
import { register } from './pages/register';
import { guestCheck } from './utils/guest-check';
import { getCookieMap } from './utils/cookie';
import { home } from './pages/home';

const init = () => router(
  [
    { path: '/', fn: home },
    { path: '/users/:id', fn: (id) => console.log(id) },
    { path: '/articles/:id', fn: ({ id, detail, aa }) => console.log(id, detail, aa) },
    { path: '/register', fn: guestCheck(register) },
    { path: '/login', fn: guestCheck(login) },
    { path: '/logout', fn: () => { } },
  ],
  {
    onNotFound: () => console.log('NOT FOUND'),
    onError: (e) => console.error(e),
    onAfter: () => {
      const bodyClassList = document.body.classList;
      const isLoggedin = Boolean(getCookieMap().get('user.id'));
      bodyClassList.add(isLoggedin ? 'is-loggedin' : 'is-guest');
      bodyClassList.remove(isLoggedin ? 'is-guest' : 'is-loggedin');
    }
  },
);

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('popstate', init);
