const renderAddRssResult = (state, i18next) => {
  console.log(state.form.errors);
  const inputElement = document.querySelector('#url-input');
  const feedbackDiv = document.querySelector('.feedback');
  const form = document.querySelector('form');

  if (state.form.isValid === false) {
    inputElement.classList.add('is-invalid');
    feedbackDiv.classList.add('text-danger');
    feedbackDiv.textContent = '';
    feedbackDiv.textContent = i18next.t('addRss.success');
    //'неуспешно'
    // i18next.t('addRss.success'); // здесь по факту другой должен быть ключ, этот указан для эксперимента
    // Cannot read properties of undefined (reading 't')
    // TypeError: Cannot read properties of undefined (reading 't')
    // причину указывать разную
  } else {
    inputElement.classList.remove('is-invalid');
    feedbackDiv.classList.remove('text-danger');
    feedbackDiv.textContent = '';
    //console.log(i18next.t('addRss.success'));
    feedbackDiv.textContent = i18next.t('addRss.success');
    //i18next.t('addRss.success');
    form.reset();
  }
};

export const renderDisable = (status) => {
  const form = document.querySelector('form');
  const button = form.querySelector('button');
  const inputElement = document.querySelector('#url-input');
  const feedbackDiv = document.querySelector('.feedback');

  if (status === 'sending') {
    button.setAttribute('disabled', '');
    inputElement.classList.remove('is-invalid');
    feedbackDiv.classList.remove('text-danger');
    feedbackDiv.textContent = '';

  }
  if (status === 'active') {
    button.removeAttribute('disabled');
  }
};

export const renderFeeds = (feeds) => {
  const feedsElement = document.querySelector('.feeds');
  const elementTitle = document.createElement('h3');
  elementTitle.textContent = "Feeds";
  const ulFeeds = document.createElement('ul');
  feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    const title = document.createElement('p');
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.textContent = feed.description;
    feedItem.append(title, description);
    ulFeeds.append(feedItem)
  })
  feedsElement.append(elementTitle, ulFeeds);
}
export default renderAddRssResult;
