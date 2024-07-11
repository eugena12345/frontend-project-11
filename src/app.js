import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult, { renderDisable, renderFeeds } from './view/render';
import i18next from 'i18next';

const parser = (data) => {
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
        if (path === 'form.isValid') {
            renderAddRssResult(state, i18next);
        }
        if (path === 'form.status') {
            renderDisable(state.form.status);
        }
        if (path === 'feeds') {
            renderFeeds(state.feeds);
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
        // работа  с формой через get 
        const rssUrl = form.elements[0].value;
        const schema = string().url().nullable(); // пересмотреть и обработать ошибки валидации, переписать запрос через аксиос
        schema.isValid(rssUrl)
            .then((data) => {
                const isDubbled = isDubble(rssUrl);
                if (data && !isDubbled) {
                    watchedState.form.status = 'sending';
                    // задизейблить кнопку
                    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`)
                        .then(response => {
                            if (response.ok) return response.json()
                            throw new Error('Network response was not ok.')
                        })
                        .then(data => {
                            const { title, description, items } = parser(data);
                            const feed = { title, description, link: rssUrl };
                            watchedState.feeds.push(feed);
                            watchedState.posts.push(items);
                            form.reset();
                            watchedState.form.isValid = true;
                            watchedState.form.status = 'active';
                        });

                } else {
                    watchedState.form.isValid = false;
                    watchedState.form.errors = 'something wrong adding errors text';
                }
            });
    });
};

export default app;
