import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // enable use of Vuex store

export default new Vuex.Store({
  state: {
    projects: {
      TestProject1: {
        name: 'Sample Project',
        description: 'Project Description. We need to figure out what data goes into projects',
        activities: [
          '<a>Elliot Fu</a> added <a>Jenny Hess</a> to the project',
          '<a>Stevie Feliciano</a> was added as an <a>Administrator</a>',
          '<a>Helen Troy</a> added two pictures'
        ],
        start_date: new Date(),
        sprint_length_days: 14
      }
      /*
      1: {
        name: 'Sample Project # 2',
        desc: 'Project Description # 2. Should this be HTML, Markdown, plain text, or something else?',
        start_date: new Date()
      },
      2: {
        name: 'Sample Project # 3',
        desc: 'Project Description # 3. We need to figure out what data goes into projects'
      } */
    },
    accountData: null,
    developmentMode: false,
    memberData: {}
  },
  getters: {
    isLoggedIn: state => !!state.accountData,
    isDevelopmentMode: state => !!state.developmentMode
  },
  mutations: {
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
