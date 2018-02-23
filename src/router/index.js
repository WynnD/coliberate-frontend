import Vue from 'vue'
import Router from 'vue-router'

import SamplePage from '@/components/SamplePage'

import Home from '@/components/Home'
import ProjectListPage from '@/components/Projects/ProjectList'
import MemberListPage from '@/components/Members/MemberList'
import SettingsPage from '@/components/Settings/Settings'

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
    },
    {
      path: '/members',
      name: 'Members',
      component: MemberListPage
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsPage
    }
  ]
})
