import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult, { renderDisable, renderFeeds } from './view/render';
import i18next from 'i18next';
import axios from 'axios';
import view from './view/index.js'

const parser = (data) => {

    const parser = new DOMParser();
    const doc3 = parser.parseFromString(data.contents, "text/xml");
    const parsererror = doc3.querySelector('parsererror');
  //  console.log('parsererror', parsererror);
    console.log('parsererror.textContent', parsererror.textContent);
    if (parsererror) {
        console.log(parsererror.textContent);
        const error = new Error('parsererror.textContent');
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
        })
    return {
        title: channelTitle.textContent,
        description: channelDescription.textContent,
        items
    };
}

const getUnique = (allPosts) => {
    return allPosts.reduce((acc, item) => {
        const isInAcc = acc.findIndex(object => object.itemLink === item.itemLink) //itemTitle, itemDescription, itemLink
        if (isInAcc === -1) {
            acc.push(item);
        }
        return acc;
    }, []);
}



const app = () => {
    const state = {
        form: {
            status: null,
            isValid: false,
            errors: null,
        },
        feeds: [],
        posts: [],
    };
    const watchedState = view(state, i18next);
    // вынести в функцию валидация+ дублирование которая вернет промис
    const isDubble = (rssUrl) => {
        const links = state.feeds.map((feed) => feed.link);
        if (links.length > 0 && links.includes(rssUrl)) {
            return true;
        }
        return false;
    };

    const validate = (rssUrl) => {
        if (isDubble(rssUrl)) {
            return new Promise((resolve, reject) => {
                reject(new Error('sameRss'));
            });

        }
        const schema = string().required().trim().url().nullable();
        return schema.validate(rssUrl);
    }


    const updatePost = (state) => {
        const getNewPosts = () => {
            return new Promise((resolve, reject) => {
                state.feeds.forEach((feed) => {
                    axios({
                        method: 'get',
                        url: `https://allorigins.hexlet.app/get?disableCache=true&url=${feed.link}`,
                    })
                        .then((response) => {

                            if (response.status === 200) {
                                return response.data;
                            };
                            watchedState.form.errors = 'bad response';
                            throw new Error('Network response was not ok.')
                        })
                        .then(data => {
                            const parsedData = parser(data);
                            if (typeof (parsedData) === 'string') {
                                watchedState.form.errors = parsedData;
                            } else {
                                const { title, description, items } = parsedData;
                                watchedState.posts = getUnique(state.posts.concat(items));
                            }
                            resolve()
                        }
                        )
                        .catch((e) => {
                            console.log(e);
                        });
                })
            });
        }
        getNewPosts();

        setTimeout(() => {
            updatePost(state)
        }, 5000)
    }


    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        watchedState.form.errors = null;
        const formData = new FormData(event.target);
        const rssUrl = formData.get('url')
        validate(rssUrl)
            .then((data) => {
                watchedState.form.status = 'sending';
                axios({
                    method: 'get',
                    url: `https://allorigins.hexlet.app/get?disableCache=true&url=${rssUrl}`,
                    timeout: 10000,
                })
                    .then((response) => {
                        console.log(response);
                        if (response.status >= 200 && response.status < 400) {
                            const parsedData = parser(response.data);
                            const { title, description, items } = parsedData;
                            const feed = { title, description, link: rssUrl }; // id добавить lodash
                            watchedState.feeds.push(feed);
                            watchedState.posts = getUnique(state.posts.concat(items));
                            form.reset();
                            watchedState.form.isValid = true;
                            watchedState.form.status = 'active';
                            return;
                        };
                    })
            })
            .catch((err) => {
                console.log(err);
                watchedState.form.isValid = false;
                //обработать ошибку нестабильного интернет соединения
                if (err.message === 'sameRss') {
                    watchedState.form.errors = 'sameRss';
                } else if (err.isParsingError) {
                    watchedState.form.errors = 'parseError';
                } else if (err.isAxiosError) {
                    watchedState.form.errors = 'networkError';
                }else {
                    watchedState.form.errors = 'invalidUrl';
                }
            })
    });

    // добавить обработчик кнопки на показать больше поста
    updatePost(state);
};

export default app;

