import { string } from 'yup';

export default (rssUrl, feeds) => {
  const links = feeds.map((feed) => feed.link);
  const schema = string().trim().required().url()
    .nullable()
    .notOneOf(links);
  return schema.validate(rssUrl);
};
