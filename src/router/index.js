import Vue from 'vue'
import Router from 'vue-router'
import luckywheel from '../components/luckywheel'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'luckywheel',
      component: luckywheel
    },
  ]
})
