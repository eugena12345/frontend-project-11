import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult, { renderDisable, renderFeeds } from './view/render';
import i18next from 'i18next';
import axios from 'axios';

const parser = (data) => {
    try {
        const parser = new DOMParser();
        const doc3 = parser.parseFromString(data.contents, "text/xml");
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
    } catch (err) {
        return 'badResponse';
    }

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
    const watchedState = onChange(state, (path, value, previousValue) => {
        // анализ путей и выхов маленьких рендер-функций переенсти в render.js также можно в папке вью сделать index.js
        if (path === 'form.isValid') {
            renderAddRssResult(state, i18next);
        }
        if (path === 'form.status') {
            renderDisable(state.form.status, i18next);
        }
        if (path === 'feeds') {
            renderFeeds(state.feeds, i18next);
        }
        if (path === 'form.errors') {
            renderAddRssResult(state, i18next);
        }
    });

    const isDubble = (rssUrl) => {
        const links = state.feeds.map((feed) => feed.link);
        if (links.length > 0 && links.includes(rssUrl)) {
            return true;
        }
        return false;
    };

    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        watchedState.form.errors = null;
        // работа  с формой через get 
        // console.log(event.target);
        // const formData = new FormData(event.target);
        //   console.log(formData);
        //  const rssUrl = formData.get('url').trim();
        //  console.log(rssUrl);
        // state.value = value;
        // state.mode = 'text';
        //render(state, nameEl);
        //////////////////
        const rssUrl = form.elements[0].value;
        const schema = string().url().nullable(); // пересмотреть и обработать ошибки валидации, переписать запрос через аксиос
        schema.validate(rssUrl)
            .then((data) => {
                console.log(data);
                const isDubbled = isDubble(rssUrl);
                if (data && !isDubbled) {
                    watchedState.form.status = 'sending';
                    axios({
                        method: 'get',
                        url: `https://allorigins.hexlet.app/get?disableCache=true&url=${rssUrl}`,
                    })
                        .then((response) => {
                                                            console.log(response);

                            if (response.status === 200) {
                                //console.log(response.data);
                                return response.data;
                            };
                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!', response);
                            watchedState.form.errors = 'bad response';
                            throw new Error('Network response was not ok.')
                        })
                        .then(data => {
                            const parsedData = parser(data);
                            if (typeof (parsedData) === 'string') {
                                watchedState.form.errors = parsedData;
                            } else {
                                const { title, description, items } = parsedData;
                                const feed = { title, description, link: rssUrl }; // id добавить lodash
                                watchedState.feeds.push(feed);
                                watchedState.posts.push(items);
                                form.reset();
                                watchedState.form.isValid = true;
                                watchedState.form.status = 'active';
                            }

                        });

                }
            })
            .catch((err) => {
                console.log(err)
                //  watchedState.form.errors = 'invalidUrl';
            })
    });
};


export default app;

