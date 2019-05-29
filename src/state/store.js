import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import modules from './modules'

Vue.use(Vuex)

const persistentMutations = []

const vuexLocal = new VuexPersistence({
  storage: window.localStorage, // default, could be omitted
  clearOn: 'logout',
  reducer: state => ({
    settings: state.settings,
    userProfile: state.userProfile
  }),
  filter: mutation =>
    persistentMutations.findIndex(m => m === mutation.type) < 0, // это если исключать "неугодные" мутации. Иначе - проверять на >= 0 и держать в массиве persistentMutations угодных
})

const store = new Vuex.Store({
  modules,
  strict: false, // process.env.NODE_ENV !== 'production',
  plugins: [vuexLocal.plugin],
})

// Automatically run the `init` action for every module,
// if one exists.
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions && modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`)
  }
}

export default store
