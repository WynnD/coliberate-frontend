import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // enable use of Vuex store

export default new Vuex.Store({
  state: {
    projects: [
      {
        id: 0,
        name: 'Sample Project',
        description: 'Project Description. We need to figure out what data goes into projects',
        activities: [
          '<a>Elliot Fu</a> added <a>Jenny Hess</a> to the project',
          '<a>Stevie Feliciano</a> was added as an <a>Administrator</a>',
          '<a>Helen Troy</a> added two pictures'
        ],
        stories: [],
        members: [0, 1],
        startDate: '2018-02-20',
        sprintLength: 14
      }
    ],
    projectList: [0],
    users: [
      {
        id: 0,
        name: 'Big Jeffrey',
        description: `I'm big, and I'm Jeffrey. Get used to it.`,
        join_date: '2018-02-25',
        projects: [0]
      },
      {
        id: 1,
        name: 'Little Wendy',
        description: `I'm little, and I'm Wendy. Get used to it.`,
        join_date: '2018-02-26',
        projects: [0]
      }
    ],
    accountData: null,
    userList: [0, 1],
    stories: [],
    developmentMode: false,
    memberData: {}
  },
  getters: {
    projectIds (state) {
      return state.projectList
    },
    newProjectId (state, getters) {
      return Math.max(getters.projectIds) + 1
    },
    projectById: state => id => {
      return state.projects.find(project => project.id === id)
    },
    isLoggedIn: state => !!state.accountData,
    isDevelopmentMode: state => !!state.developmentMode
  },

  mutations: {
    addProject (state, project) {
      state.projects.push(project)
      state.projectList.push(project.id)
    },
    deleteProject (state, id) {
      state.projects = state.projects.filter(project => project.id !== id)
    },
    setDevelopmentMode (state, newData) {
      state.developmentMode = newData === true
    },
    login (state, accountData) {
      state.accountData = accountData
    },
    logout (state) {
      state.accountData = null
    },
    updateMemberData (state, newData) {
      state.memberData = newData
    },
    updateProjectList (state, newData) {
      state.projects = newData
    }
  }
})
