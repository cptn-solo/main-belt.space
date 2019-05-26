import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_ANALYTICS_ID,
  router,
})
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
