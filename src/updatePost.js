import axios from 'axios';
import differenceWith from 'lodash/differenceWith';
import uniqueId from 'lodash/uniqueId';
import {
  getFeedUrl, parser,
} from './supportingFunc';

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
          const newPosts = differenceWith(items, oldPosts, (p1, p2) => p1.title === p2.title)
            .map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
          // console.log(newPosts);
          watchedState.posts.unshift(...newPosts);
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
