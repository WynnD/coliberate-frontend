export default {
  addProject (state, project) {
    if (state.projects[project.id]) {
      throw Error(`Project ID ${project.id} already exists.`)
    }
    state.projects[project.id] = project
  },
  deleteProject (state, id) {
    delete state.projects[id]
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
    state.members = newData
  },
  updateProjectList (state, newData) {
    state.projects = newData
  }
}
