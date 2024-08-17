import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult, { renderDisable, renderFeeds } from './view/render';
import i18next from 'i18next';
import axios from 'axios';
import view from './view/index.js'
import uniqueId from 'lodash/uniqueId';


const parser = (data) => {

    const parser = new DOMParser();
    const doc3 = parser.parseFromString(data.contents, "text/xml");
    const parsererror = doc3.querySelector('parsererror');
    if (parsererror) {
        console.log(parsererror.textContent);
        const error = new Error('parsererror.textContent');
        console.log(error);
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

const addNewPosts = (oldItems, freshItems) => {
    const newPosts = [];
    freshItems.forEach((item) => {
        const matchColl = oldItems.filter((oldItem) => oldItem.itemTitle === item.itemTitle);
        if (matchColl.length > 0) {
            //console.log(`match`);
        } else {
            item.id = uniqueId();
            newPosts.push(item);
        }
    })
    const newUpdateArray = oldItems.concat(newPosts);
    return newUpdateArray;
}



const app = () => {
    const state = {
        form: {
            status: null,
            isValid: false,
            errors: null,
        },
        modal: {
            show: false,
            info: null,
        },
        feeds: [],
        posts: [],
    };

    const watchedState = view(state, i18next);

    const validate = (rssUrl) => {
        const links = state.feeds.map((feed) => feed.link);
        const schema = string().required().trim().url().nullable().notOneOf(links);
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
                                watchedState.posts = addNewPosts(state.posts, items);
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
                        if (response.status >= 200 && response.status < 400) {
                            const parsedData = parser(response.data);
                            const { title, description, items } = parsedData;
                            const feed = { title, description, link: rssUrl, id: uniqueId() };
                            watchedState.feeds.push(feed);
                            watchedState.posts = addNewPosts(state.posts, items);
                            form.reset();
                            watchedState.form.isValid = true;
                            watchedState.form.status = 'active';
                            return;
                        };
                    })
                    .catch((err) => {
                        watchedState.form.isValid = false;
                        if (err.message === 'Network Error') {
                            watchedState.form.errors = 'networkError';
                        } else if (err.isParsingError) {
                            watchedState.form.errors = 'parseError';
                        };
                        watchedState.form.status = 'active';

                    })
            })
            .catch((err) => {
                console.log(err.type);

                watchedState.form.isValid = false;

                if (err.type === 'notOneOf') {
                    watchedState.form.errors = 'sameRss';
                } else {
                    watchedState.form.errors = 'invalidUrl';
                }
            })
    });

    updatePost(state);

    const modal = document.querySelector('.modal');
modal.addEventListener('show.bs.modal', (event) => {
    const clickedButton = event.relatedTarget;
    const id = clickedButton.getAttribute('data-id')
    const currentPost = state.posts.filter((post) => post.id === id)[0];
    console.log(currentPost);
    const modalTitle = modal.querySelector('.modal-title');
    console.log('modalTitle',modalTitle);

    modalTitle.textContent = currentPost.itemTitle;
    const modalBody = modal.querySelector('.modal-body');
    modalBody.textContent = currentPost.itemDescription;
})
};

export default app;

