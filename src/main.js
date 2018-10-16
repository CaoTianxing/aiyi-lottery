// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import router from './router'
import axios from 'axios'
Vue.use(Mint);
Vue.prototype.$ajax = axios
const baseURL = 'https://api-art-app.artmkt.com'
axios.defaults.baseURL = baseURL;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
