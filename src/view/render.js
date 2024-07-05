const renderAddRssResult = (state, i18next) => {
  console.log(state.errColl);
  console.log(i18next.t('key'));
  const inputElement = document.querySelector('#url-input');
  // const divInput = document.querySelector('.mx-auto');
  const feedbackDiv = document.querySelector('.feedback');
  const form = document.querySelector('form');

  // addingRssResult.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  if (state.validationResult === false) {
    inputElement.classList.add('is-invalid');
    feedbackDiv.classList.add('text-danger');
    feedbackDiv.textContent = '';
    feedbackDiv.textContent = 'RSS НЕЕЕЕЕ загружен'; // причину указывать разную
  } else {
    inputElement.classList.remove('is-invalid');
    feedbackDiv.classList.remove('text-danger');
    feedbackDiv.textContent = '';
    console.log(i18next.t('addRss.success'));
    feedbackDiv.textContent = i18next.t('addRss.success');
    form.reset();
  }
  // divInput.append(addingRssResult);
};
export default renderAddRssResult;
