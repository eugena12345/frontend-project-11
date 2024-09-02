export default (data) => {
  const parserForData = new DOMParser();
  const doc3 = parserForData.parseFromString(data.contents, 'text/xml');
  const parsererror = doc3.querySelector('parsererror');
  if (parsererror) {
    const error = new Error(parsererror.textContent);
    error.isParsingError = true;
    throw error;
  }
  const channel = doc3.querySelector('channel');
  const channelTitle = channel.querySelector('title');
  const channelDescription = channel.querySelector('description');
  const items = [...doc3.querySelectorAll('item')]
    .map((item) => {
      const itemTitle = item.querySelector('title').textContent;
      const itemDescription = item.querySelector('description').textContent;
      const itemLink = item.querySelector('link').textContent;
      return { itemTitle, itemDescription, itemLink };
    });
  return {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    items,
  };
};
