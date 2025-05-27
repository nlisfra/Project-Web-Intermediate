import loginPresenter from './presenter/loginPresenter.js';
import registerPresenter from './presenter/registerPresenter.js';
import storyPresenter from './presenter/ceritaPresenter.js';
import notFoundView from './view/notFoundView.js';
import savedStoryPresenter from './presenter/savedStoryPresenter.js';
import addStoryPresenter from './presenter/addStoryPresenter.js';

const routes = {
  '#/login': loginPresenter,
  '#/register': registerPresenter,
  '#/stories': storyPresenter,
  '#/add': addStoryPresenter,
  '#/saved': savedStoryPresenter,
};

let currentPresenter = null;

async function router() {
  const container = document.getElementById('app');

  if (currentPresenter && typeof currentPresenter.destroy === 'function') {
    currentPresenter.destroy();
  }

  const hash = window.location.hash || '#/login';

  const presenter = routes[hash];
  if (presenter && typeof presenter.init === 'function') {
    currentPresenter = presenter;
    await presenter.init(container);
  } else {
    container.innerHTML = '';
    notFoundView.render();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

export { router };