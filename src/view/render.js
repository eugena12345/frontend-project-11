export const renderAddRssResult = (state, i18next) => {
  // console.log(state.form.errors);
  const inputElement = document.querySelector('#url-input');
  const feedbackDiv = document.querySelector('.feedback');
  const form = document.querySelector('form');

  if (state.form.isValid === false) {
    inputElement.classList.add('is-invalid');
    feedbackDiv.classList.add('text-danger');
    feedbackDiv.textContent = '';
    feedbackDiv.textContent = i18next.t(`addRss.fail.${state.form.errors}`);
  } else {
    inputElement.classList.remove('is-invalid');
    feedbackDiv.classList.remove('text-danger');
    feedbackDiv.textContent = '';
    feedbackDiv.textContent = i18next.t('addRss.success');
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
  feedsElement.textContent = '';
  const elementTitle = document.createElement('h3');
  elementTitle.textContent = "Фиды";
  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add("list-group", "border-0", "rounded-0");
  feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add("list-group-item", "border-0", "border-end-0")
    const title = document.createElement('h3');
    title.classList.add("h6", "m-0");
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.classList.add("m-0", "small", "text-black-50")
    description.textContent = feed.description;
    feedItem.append(title, description);
    ulFeeds.append(feedItem)
  })
  feedsElement.append(elementTitle, ulFeeds);
}

export const renderPosts = (posts) => {
  const postsElement = document.querySelector('.posts');
  postsElement.textContent = '';
  const elementTitle = document.createElement('h3');
  elementTitle.textContent = "Посты";
  const ulPosts = document.createElement('ul');
  ulPosts.classList.add("list-group", "border-0", "rounded-0");//list-group border-0 rounded-0
  posts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start", "border-0", "border-end-0");
    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.setAttribute('href', post.itemLink);
    link.setAttribute('data-id', 2); // add ID
    link.text = post.itemTitle;
    const buttonPost = document.createElement('button');
    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPost.setAttribute('type', 'button');
    buttonPost.setAttribute('data-id', '202');
    buttonPost.setAttribute('data-bs-toggle', "modal");
    buttonPost.setAttribute('data-bs-target', '#modal');
    buttonPost.textContent = 'Просмотр';
    postItem.append(link, buttonPost);
    ulPosts.append(postItem);

  })
  postsElement.append(elementTitle, ulPosts);
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach((button) => {
    button.addEventListener(('click'), () => {
      console.log('sdfsfdsdffffffffffffffffffffffffffffff')
    });
  }
  );
}