import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import ProjectListPage from '@/components/Projects/ProjectList'
import SingleProjectLandingPage from '@/components/Projects/SingleProjectLandingPage'
import LoginPage from '@/components/Members/Login'
import RegisterPage from '@/components/Members/Register'
import MemberListPage from '@/components/Members/MemberList'
import SingleMemberPage from '@/components/Members/SingleMemberPage'
import SettingsPage from '@/components/Settings/Settings'
import NotFoundPage from '@/components/NotFoundPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundPage },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectListPage
    },
    {
      path: '/projects/:id',
      component: SingleProjectLandingPage
    },
    {
      path: '/members',
      name: 'Members',
      component: MemberListPage
    },
    {
      path: '/members/:id',
      component: SingleMemberPage
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsPage
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage
    }
  ]
})
