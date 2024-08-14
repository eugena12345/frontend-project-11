import {renderAddRssResult, renderDisable, renderFeeds, renderPosts, renderModal} from './render.js'
import onChange from 'on-change';

export default (state, i18next) => {
    
    return onChange(state, (path, value, previousValue) => {
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
            renderPosts(state.posts, i18next);
        }
        if (path === 'form.errors') {
            renderAddRssResult(state, i18next);
        }
        if (path === 'modal.show') {
            renderModal(state.modal.info, i18next);
        }
            });
    
};