import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SamplePage from '@/components/SamplePage'
import ProjectListPage from '@/components/Projects/ProjectList'
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
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectListPage
    }
  ]
})
