import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // enable use of Vuex store

export default new Vuex.Store({
  state: {
    projectData: {
      SampleProjectID: {
        name: 'Sample Project',
        id: 'SampleProjectID',
        description: 'Project Description. We need to figure out what data goes into projects'
      },
      SampleProjectID2: {
        name: 'Sample Project # 2',
        id: 'SampleProjectID2',
        description: 'Project Description # 2. Should this be HTML, Markdown, plain text, or something else?'
      },
      SampleProjectID3: {
        name: 'Sample Project # 3',
        id: 'SampleProjectID3',
        description: 'Project Description # 3. We need to figure out what data goes into projects'
      }
    }
  },
  mutations: {
  }
})
