import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult from './view/render';

// const inputElement = document.querySelector('#url-input');
const app = () => {
  const state = {
    urlColl: [],
    errColl: [],
    validationResult: null,
  };
  const watchedState = onChange(state, (path, value, previousValue) => {
    console.log(`Путь "${path}" изменился с ${previousValue} на ${value}`);
    if (path === 'validationResult') {
      renderAddRssResult(state);
    }
  });

  const isDubble = (rssUrl) => {
    console.log(state.urlColl.includes(rssUrl));
    console.log(state.urlColl);

    if (state.urlColl.includes(rssUrl)) {
      return true;
    }
    return false;
  };

  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const rssUrl = form.elements[0].value;
    const schema = string().url().nullable(); // пересмотреть
    schema.isValid(rssUrl)
      .then((data) => {
        const isDubbled = isDubble(rssUrl);
        if (data && !isDubbled) {
          watchedState.urlColl.push(rssUrl);
          watchedState.validationResult = true;
        } else {
          watchedState.validationResult = false;
          watchedState.errColl.push('something wrong');
        }
      });
  });
};

export default app;
