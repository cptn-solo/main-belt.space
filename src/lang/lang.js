import Vue from 'vue'
import VueI18n from 'vue-i18n'

import ru from './ru.json'
import en from './en.json'
import ch from './ch.json'
import dev from './dev.json'
// import tw from './tw.json'
// import es from './es.json'

Vue.use(VueI18n)

const locale = 'en'

const messages = {
  ru,
  en,
  ch,
  dev,
}

const i18n = new VueI18n({
  locale,
  messages,
  fallbackLocale: 'en',
})

export default i18n
