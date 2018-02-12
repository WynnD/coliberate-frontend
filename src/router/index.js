import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SamplePage from '@/components/SamplePage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/SamplePage',
      name: 'Sample Page',
      component: SamplePage
    }
  ]
})
