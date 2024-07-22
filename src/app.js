import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult, { renderDisable, renderFeeds } from './view/render';
import i18next from 'i18next';
import axios from 'axios';
import view from './view/index.js'

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
            //watchedState.form.errors = 'sameRss';
            return new Promise((resolve, reject) => {
                reject(new Error('sameRss'));
            });

        }
        const schema = string().required().trim().url().nullable(); // пересмотреть и обработать ошибки валидации и пустая строка, переписать запрос через аксиос 
        return schema.validate(rssUrl);
    }

    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        watchedState.form.errors = null;
        const formData = new FormData(event.target);
        const rssUrl = formData.get('url')
        validate(rssUrl)
            // const schema = string().required().trim().url().nullable(); // пересмотреть и обработать ошибки валидации и пустая строка, переписать запрос через аксиос 
            // schema.validate(rssUrl)
            .then((data) => {
                console.log(data);
                // const isDubbled = isDubble(rssUrl);
                if (data) {
                    watchedState.form.status = 'sending';
                    axios({
                        method: 'get',
                        url: `https://allorigins.hexlet.app/get?disableCache=true&url=${rssUrl}`,
                    })
                        .then((response) => {
                            console.log(response);
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
                                const feed = { title, description, link: rssUrl }; // id добавить lodash
                                watchedState.feeds.push(feed);
                                console.log(items)
                                watchedState.posts = watchedState.posts.concat(items)
                                form.reset();
                                watchedState.form.isValid = true;
                                watchedState.form.status = 'active';
                            }
                        })
                        .then(() => {
                            console.log('state.feeds.length', state.feeds.length)
                            if (state.feeds.length < 2) {
                                updatePost(state);
                            }

                        });
                }
            })
            .catch((err) => {
                // console.log(err.message);
                watchedState.form.isValid = false;
                //обработать ошибку нестабильного интернет соединения
                if (err.message === 'sameRss') {
                    watchedState.form.errors = 'sameRss';
                } else {
                    watchedState.form.errors = 'invalidUrl';
                }
            })

    });

    updatePost(state);

};


const updatePost = (state) => {
    //console.log(`update`)
    if (state.feeds.length > 0) {
        //console.log(`state.feeds.length > 0`)
        const getNewPosts = () => {
            return new Promise((resolve, reject) => {
                state.feeds.forEach((feed) => {
                    console.log(`feed`, feed)

                    axios({
                        method: 'get',
                        url: `https://allorigins.hexlet.app/get?disableCache=true&url=${feed.link}`,
                    })
                        .then((response) => {
                            console.log(state.feeds);
                            // response
                            resolve()
                        }
                        )

                        .catch((e) => {
                            console.log(e);
                        });
                })
            });


        }
        return getNewPosts()
            .then(() => {
                setTimeout(() => {
                    updatePost(state)
                }, 5000)
            }
            );

    }

}



export default app;

