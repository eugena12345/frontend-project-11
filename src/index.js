import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';

const inputElement = document.querySelector('#url-input');

const state = {
  urlColl: [],
};
const watchedState = onChange(state, (path, value, previousValue) => {
  console.log(`Путь "${path}" изменился с ${previousValue} на ${value}`);
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

// console.log(form);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const rssUrl = form.elements[0].value;
  const schema = string().url().nullable();
  schema.isValid(rssUrl)
    .then((data) => {
      const isDubbled = isDubble(rssUrl);
      console.log(isDubbled);
      if (data && !isDubbled) {
        watchedState.urlColl.push(rssUrl);
        inputElement.classList.remove('is-invalid');
        form.reset();
        console.log(state);
      } else {
        const divInput = document.querySelector('.mx-auto');
        const addingRssResult = document.createElement('p');
        addingRssResult.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
        addingRssResult.textContent = 'RSS НЕЕЕЕЕ загружен';
        divInput.append(addingRssResult);
        console.log('не содержит валидный рсс');
        inputElement.classList.add('is-invalid');
      }
    });
});
