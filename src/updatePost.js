import axios from 'axios';
import i18next from 'i18next';
import { getFeedUrl, parser, addNewPosts } from './supportingFunc';
import view from './view/index';

const updatePost = (stateForUpdate) => {
  const watchedState = view(stateForUpdate, i18next);
  const getNewPosts = () => new Promise((resolve) => {
    stateForUpdate.feeds.forEach((feed) => {
      axios({
        method: 'get',
        url: getFeedUrl(feed.link),
      })
        .then((response) => {
          const parsedData = parser(response.data);
          const { items } = parsedData;
          watchedState.posts = addNewPosts(stateForUpdate.posts, items);

          resolve();
        });
      // .catch((e) => {
      //   console.log(e);
      //   throw new Error('Network response was not ok.');
      // });
    });
  });
  getNewPosts();

  setTimeout(() => {
    updatePost(stateForUpdate);
  }, 5000);
};

export default updatePost;
