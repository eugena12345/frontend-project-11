import axios from 'axios';
// import i18next from 'i18next';
import {
  getFeedUrl, parser, addNewPosts,
} from './supportingFunc';
// import view from './view/index';

const updatePost = (watchedState) => {
  // console.log(`update`)
  // const watchedState = view(stateForUpdate, i18next);
  const getNewPosts = () => new Promise((resolve) => {
    watchedState.feeds.forEach((feed) => {
      axios({
        method: 'get',
        url: getFeedUrl(feed.link),
      })
        .then((response) => {
          const parsedData = parser(response.data);
          const { items } = parsedData;
          const newPost = addNewPosts(watchedState.posts, items);
          // const newPost = [{itemTitle: 'Lorem ipsum 2024-08-26T21:04:00Z', itemDescription: 'Tempor magna amet occaecat consequat exercitation … officia sint amet reprehenderit est fugiat quis.', itemLink: 'http://example.com/test/1724706240', id: '12'}];
          // console.log('watchedState.posts', watchedState.posts);
          //    if (newPost) {
          // watchedState.posts.unshift(newPost);
          watchedState.posts.unshift(newPost);
          // = newPost.concat(watchedState.posts);
          //   }
          // addNewPosts(watchedState.posts, items);

          resolve();
        });
    });
  });
  getNewPosts();

  setTimeout(() => {
    updatePost(watchedState);
  }, 5000);
};

export default updatePost;
