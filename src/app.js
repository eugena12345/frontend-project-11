import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import view from './view/index';
import ru from './translation';
import validate, {
  getFeedUrl, parser, getErrorType,
} from './supportingFunc';
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
  const errorHandler = (error) => {
    watchedState.form.isValid = false;
    watchedState.form.errors = getErrorType(error);
    watchedState.form.status = 'active';
  };

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
              const itemsWithId = items.map((item) => {
                const newItem = item;
                newItem.id = uniqueId();
                return newItem;
              });
              watchedState.posts = itemsWithId.concat(state.posts);
              form.reset();
              watchedState.form.isValid = true;
              watchedState.form.status = 'active';
            }
          })
          .catch((err) => {
            errorHandler(err);
          });
      })
      .catch((err) => {
        errorHandler(err);
      });
  });

  updatePost(state);

  const modal = document.querySelector('.modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const clickedButton = event.relatedTarget;
    const id = clickedButton.getAttribute('data-id');
    watchedState.modal.currentPost = id;
    watchedState.visitedLinkIds = [...state.visitedLinkIds, id];
  });

  const posts = document.querySelector('.posts');
  posts.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'A') {
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
