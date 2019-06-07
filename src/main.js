import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import router from "./router";
import store from "./state/store";
import i18n from './lang/lang'
import VuetifyDialog from 'vuetify-dialog'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
Vue.use(VuetifyDialog)
Vue.use(Loading, { color: '#fff', backgroundColor: '#002', opacity: 0.47 })

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
