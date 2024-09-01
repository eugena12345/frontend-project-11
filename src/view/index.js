import onChange from 'on-change';
import {
  renderAddRssResult, renderDisable, renderFeeds, renderModal, renderPosts,
} from './render.js';

export const elements = {
  form: document.querySelector('form'),
  modal: document.querySelector('.modal'),
  posts: document.querySelector('.posts'),
  inputElement: document.querySelector('#url-input'),
  feedbackDiv: document.querySelector('.feedback'),
  button: document.querySelector('button[type="submit"]'),
  feedsElement: document.querySelector('.feeds'),
  postsElement: document.querySelector('.posts'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  readMoreButton: document.querySelector('.btn-primary'),
};

export default (state, i18next) => onChange(state, (path) => {
  if (path === 'form.isValid' || path === 'form.errors') {
    renderAddRssResult(state, i18next, elements);
  }
  if (path === 'form.status') {
    renderDisable(state.form.status, i18next, elements);
  }
  if (path === 'feeds') {
    renderFeeds(state.feeds, i18next, elements);
  }
  if (path === 'posts' || path === 'visitedLinkIds') {
    renderPosts(state.posts, state.visitedLinkIds, i18next, elements);
  }
  if (path === 'modal.currentPost') {
    renderModal(state.posts, state.modal.currentPost, elements);
  }
});
