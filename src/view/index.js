import onChange from 'on-change';
import {
  renderAddRssResult, renderDisable, renderFeeds, renderPosts,
} from './render';
// .js
// renderModal,

export default (state, i18next) => onChange(state, (path) => { // , value, previousValue
  if (path === 'form.isValid') {
    renderAddRssResult(state, i18next);
  }
  if (path === 'form.status') {
    renderDisable(state.form.status, i18next);
  }
  if (path === 'feeds') {
    renderFeeds(state.feeds, i18next);
  }
  if (path === 'posts') {
    renderPosts(state.posts, state.visitedLinkIds, i18next);
  }
  if (path === 'form.errors') {
    renderAddRssResult(state, i18next);
  }
  if (path === 'visitedLinkIds') {
    renderPosts(state.posts, state.visitedLinkIds, i18next);
  }
});
