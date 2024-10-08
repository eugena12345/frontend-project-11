import axios from 'axios';
import differenceWith from 'lodash/differenceWith.js';
import uniqueId from 'lodash/uniqueId.js';
import { getFeedUrl } from './supportingFunc.js';
import parser from './parser.js';

const compareTitle = (p1, p2) => p1.itemTitle === p2.itemTitle;

const updatePost = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => axios({
    method: 'get',
    url: getFeedUrl(feed.link),
  })
    .then((response) => {
      const parsedData = parser(response.data);
      const { items } = parsedData;
      const oldPosts = watchedState.posts.filter((post) => post.feedId === feed.id);
      const newPosts = differenceWith(items, oldPosts, compareTitle)
        .map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
      watchedState.posts.unshift(...newPosts);
    })
    // eslint-disable-next-line no-console
    .catch((e) => console.log(e)));

  Promise.all(promises).finally(() => {
    setTimeout(() => {
      updatePost(watchedState);
    }, 5000);
  });
};

export default updatePost;
