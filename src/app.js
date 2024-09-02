import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import view, { elements } from './view/index.js';
import ru from './locales/ru/translation.js';
import {
  validate, getFeedUrl, getErrorType,
} from './supportingFunc.js';
import updatePost from './updatePost.js';
import parser from './parser.js';

const app = () => {
  const state = {
    form: {
      status: null,
      isValid: false,
      errors: null,
    },
    modal: {
      show: false,
      currentPost: null,
    },
    feeds: [],
    posts: [],
    visitedLinkIds: [],
  };

  const watchedState = view(state, i18next);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.form.errors = null;
    const formData = new FormData(event.target);
    const rssUrl = formData.get('url');
    validate(rssUrl, state.feeds)
      .then((err) => {
        if (err) {
          watchedState.form.isValid = false;
          watchedState.form.errors = getErrorType(err);
          watchedState.form.status = 'active';
          return;
        }
        watchedState.form.status = 'sending';
        axios({
          method: 'get',
          url: getFeedUrl(rssUrl),
          timeout: 10000,
        })
          .then((response) => {
            if (response.status >= 200 && response.status < 400) {
              const parsedData = parser(response.data);
              const { title, description, items } = parsedData;
              const feed = {
                title, description, link: rssUrl, id: uniqueId(),
              };
              watchedState.feeds.unshift(feed);
              const itemsWithId = items.map((item) => {
                const newItem = item;
                newItem.id = uniqueId();
                newItem.feedId = feed.id;
                return newItem;
              });
              watchedState.posts.unshift(...itemsWithId);
              elements.form.reset();
              watchedState.form.isValid = true;
              watchedState.form.status = 'active';
            }
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.errors = getErrorType(error);
            watchedState.form.status = 'active';
          });
      });
  });

  updatePost(watchedState);

  elements.modal.addEventListener('show.bs.modal', (event) => {
    const clickedButton = event.relatedTarget;
    const id = clickedButton.getAttribute('data-id');
    watchedState.modal.currentPost = id;
    watchedState.visitedLinkIds = [...state.visitedLinkIds, id];
  });

  elements.posts.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.getAttribute('data-type') === 'link') {
      const linkId = clickedElement.getAttribute('data-id');
      watchedState.visitedLinkIds = [...state.visitedLinkIds, linkId];
    }
  });
};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => {
      app();
    });
};
