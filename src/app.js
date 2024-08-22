import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import view from './view/index';
import ru from './translation';
import validate, { getFeedUrl, parser, addNewPosts } from './supportingFunc';
import updatePost from './updatePost';

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

  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.form.errors = null;
    const formData = new FormData(event.target);
    const rssUrl = formData.get('url');
    validate(rssUrl, state.feeds)
      .then(() => {
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
              watchedState.posts = addNewPosts(state.posts, items);
              form.reset();
              watchedState.form.isValid = true;
              watchedState.form.status = 'active';
            }
          })
          .catch((err) => {
            watchedState.form.isValid = false;
            if (err.message === 'Network Error') {
              watchedState.form.errors = 'networkError';
            } else if (err.isParsingError) {
              watchedState.form.errors = 'parseError';
            }
            watchedState.form.status = 'active';
          });
      })
      .catch((err) => {
        watchedState.form.isValid = false;
        if (err.type === 'notOneOf') {
          watchedState.form.errors = 'sameRss';
        } else {
          watchedState.form.errors = 'invalidUrl';
        }
      });
  });

  updatePost(state);

  const modal = document.querySelector('.modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const clickedButton = event.relatedTarget;
    const id = clickedButton.getAttribute('data-id');
    const currentPost = state.posts.filter((post) => post.id === id)[0];
    watchedState.modal.currentPost = currentPost;
    watchedState.visitedLinkIds = [...state.visitedLinkIds, id];
  });

  const posts = document.querySelector('.posts');
  posts.addEventListener('click', (event) => {
    event.preventDefault();
    const clickedElement = event.target;
    if (clickedElement.tagName === 'A') {
      clickedElement.onClick = window.open(clickedElement.href, '_blank');
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
