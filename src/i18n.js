import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'
import {createI18n} from "vue-i18n";

app.use(i18n)

export default createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'en',
    messages: { en, es }
})
