import axios from 'axios';
// import i18next from 'i18next';
import {
  getFeedUrl, parser, checkNewPosts,
} from './supportingFunc';
// import view from './view/index';

const updatePost = (watchedState) => {
  const getNewPosts = () => new Promise((resolve) => {
    watchedState.feeds.forEach((feed) => {
      axios({
        method: 'get',
        url: getFeedUrl(feed.link),
      })
        .then((response) => {
          const parsedData = parser(response.data);
          const { items } = parsedData;
          const oldPosts = watchedState.posts.filter((post) => post.feedId === feed.id);
          const newPosts = checkNewPosts(oldPosts, items);
          watchedState.posts.unshift(newPosts);
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
