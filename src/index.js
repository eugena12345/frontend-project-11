import i18next from 'i18next';
import app from './app';
import ru from './translation.js';



i18next.init({
  lng: 'ru', // Текущий язык
  debug: false,
  resources: {
    ru,
  },
})
  .then(() => {
    app();
  });
