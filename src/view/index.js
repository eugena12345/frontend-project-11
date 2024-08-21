import onChange from 'on-change';
import {
  renderAddRssResult, renderDisable, renderFeeds, renderModal, renderPosts,
} from './render';

export default (state, i18next) => onChange(state, (path) => { // , value, previousValue
  if (path === 'form.isValid' || path === 'form.errors') {
    renderAddRssResult(state, i18next);
  }
  if (path === 'form.status') {
    renderDisable(state.form.status, i18next);
  }
  if (path === 'feeds') {
    renderFeeds(state.feeds, i18next);
  }
  if (path === 'posts' || path === 'visitedLinkIds') {
    renderPosts(state.posts, state.visitedLinkIds, i18next);
  }
  if (path === 'modal.currentPost') {
    renderModal(state.modal.currentPost);
  }
});
