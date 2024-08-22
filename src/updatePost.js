import axios from 'axios';
import i18next from 'i18next';
import { getFeedUrl, parser, addNewPosts } from './supportingFunc';
import view from './view/index';

const updatePost = (stateForUpdate) => {
  const watchedState = view(stateForUpdate, i18next);
  //   console.log(watchedState.posts);
  const getNewPosts = () => new Promise((resolve) => {
    stateForUpdate.feeds.forEach((feed) => {
      axios({
        method: 'get',
        url: getFeedUrl(feed.link),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          watchedState.form.errors = 'bad response';
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          const parsedData = parser(data);
          if (typeof (parsedData) === 'string') {
            watchedState.form.errors = parsedData;
          } else {
            const { items } = parsedData;
            watchedState.posts = addNewPosts(stateForUpdate.posts, items);
          }
          resolve();
        });
      //   .catch((e) => {
      //     // console.log(e);
      //   });
    });
  });
  getNewPosts();

  setTimeout(() => {
    updatePost(stateForUpdate);
  }, 5000);
};

export default updatePost;
