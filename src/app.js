import './styles.scss';
import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import renderAddRssResult from './view/render';
import i18next from 'i18next';

// const inputElement = document.querySelector('#url-input');
const getcontent = (content) => {
    if (content.includes('[CDATA')) {
        return content.match(/(?<=(\[CDATA\[)).*(?=\]\])/gm).join('');
    }
    return content;
}

const app = () => {
    const state = {
        urlColl: [],
        errColl: [],
        validationResult: null,
    };
    const watchedState = onChange(state, (path, value, previousValue) => {
        console.log(`Путь "${path}" изменился с ${previousValue} на ${value}`);
        if (path === 'validationResult') {
            renderAddRssResult(state, i18next);
        }
    });

    const isDubble = (rssUrl) => {
        console.log(state.urlColl.includes(rssUrl));
        console.log(state.urlColl);

        if (state.urlColl.includes(rssUrl)) {
            return true;
        }
        return false;
    };

    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const rssUrl = form.elements[0].value;
        const schema = string().url().nullable(); // пересмотреть
        schema.isValid(rssUrl)
            .then((data) => {
                const isDubbled = isDubble(rssUrl);
                if (data && !isDubbled) {
                    // задизейблить кнопку
                    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`)
                        .then(response => {
                            if (response.ok) return response.json()
                            throw new Error('Network response was not ok.')
                        })
                        .then(data => {
                            const parser = new DOMParser();
                            const doc3 = parser.parseFromString(data.contents, "text/html");
                            const channel = doc3.querySelector('channel');
                            const channelTitle = channel.querySelector('title');
                            const channelDescription = channel.querySelector('description');
                            // const title = simplexml_load_file(channelTitle, null, LIBXML_NOCDATA);
                            const items = doc3.querySelectorAll('item'); // have a titel and a description


                            console.log(getcontent(channelTitle.textContent)); 
                            console.log(getcontent(channelDescription.textContent));
                            // console.log(doc3.body)
                            console.log(items)
                            form.reset();
                            // раздизейблить кнопку
                        });
                    watchedState.urlColl.push(rssUrl);
                    watchedState.validationResult = true;
                } else {
                    watchedState.validationResult = false;
                    watchedState.errColl.push('something wrong');
                }
            });
    });
};

export default app;
