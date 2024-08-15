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
//const button = document.createElement('div');
// button.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
// Launch demo modal
// </button>`;
    
     const buttonPost = document.createElement('button');
     buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
     buttonPost.setAttribute('type', 'button');
     buttonPost.setAttribute('data-id', post.id); // add ID
     buttonPost.textContent = 'Просмотр';
     buttonPost.dataset.bsToggle = 'modal';
     buttonPost.dataset.bsTarget = '#exampleModal';
    postItem.append(link, buttonPost); //  button
    ulPosts.append(postItem);

  })
  postsElement.append(elementTitle, ulPosts);

  {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Launch demo modal
  </button> */}

  // const allButtons = document.querySelectorAll('button');
  // allButtons.forEach((button) => {
  //   button.addEventListener(('click'), () => {
  //     console.log('sdfsfdsdffffffffffffffffffffffffffffff')
  //   });
  // }
  // );
}

export const renderModal = (info) => {
  const body = document.body;

  // const modal = document.createElement('div');
  const modal = document.querySelector('.modal');
  console.log(modal);
//   modal.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
//   Launch demo modal
// </button>`;
  

  // body.classList.add('modal-open');
  // body.setAttribute('style', 'overflow: hidden; padding-right: 14px')
  // modal.classList.add('modal', 'fade', 'show');
  // modal.setAttribute('style', 'display: block');
  // modal.setAttribute('tabindex', '-1');
  // modal.setAttribute('aria-modal', 'true');
  // modal.setAttribute('data-bs-backdrop', 'static'); 
  // modal.innerHTML = (`<div class="modal-dialog">
  //       <div class="modal-content">
  //         <div class="modal-header">
  //           <h5 class="modal-title">${info.itemTitle}</h5>
  //           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  //         </div>
  //         <div class="modal-body">
  //           <p>${info.itemDescription}</p>
  //         </div>
  //         <div class="modal-footer">
  //           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  //           <button type="button" class="btn btn-primary">Save changes</button>
  //         </div>
  //       </div>
  //     </div>`)




      
 // body.prepend(modal);

  // const closeButton = document.querySelector('.btn-close');
  // //console.log(closeButton);
  // closeButton.addEventListener('click', (e) => {
  //   e.preventDefault()
  //     modal.remove();
  //     body.removeAttribute('style', 'overflow: hidden; padding-right: 14px');
  //     body.classList.remove('modal-open');
  //     //modal.style.display = 'none';
  // })
}