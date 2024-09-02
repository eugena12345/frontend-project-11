import { string } from 'yup';
import axios from 'axios';

export const validate = (rssUrl, feeds) => {
  const links = feeds.map((feed) => feed.link);
  const schema = string().trim().required().url()
    .nullable()
    .notOneOf(links);
  return schema.validate(rssUrl)
    .then(() => null)
    .catch((e) => e);
};

export const getFeedUrl = (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`;

export const getErrorType = (error) => {
  if (axios.isAxiosError(error)) {
    return 'networkError';
  }
  if (error.isParsingError) {
    return 'parseError';
  }
  if (error.type === 'notOneOf') {
    return 'sameRss';
  }
  return 'invalidUrl';
};

export const errorHandler = (error, watchedState) => {
  watchedState.form.isValid = false;
  watchedState.form.errors = getErrorType(error);
  watchedState.form.status = 'active';
};
