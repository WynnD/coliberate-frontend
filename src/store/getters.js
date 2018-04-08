export default {
  projectIds: state => Object.keys(state.projects),
  newProjectId: state => Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
  projectById: state => id => state.projects[id],
  isLoggedIn: state => !!state.accountData,
  isDevelopmentMode: state => !!state.developmentMode,
  currentUser: state => state.accountData,
  memberById: state => id => state.members[id]
}
