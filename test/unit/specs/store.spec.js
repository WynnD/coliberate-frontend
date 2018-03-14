import {state, getters, mutations} from '@/store'

const projectToAdd = {id: 1}
const userToAdd = {id: 2}

// deprecated as projectList is non-existent with new data store format March 2018
// test('addProject adds project id to projectList', () => {
//   mutations.addProject(state, projectToAdd)
//   expect(
//     Object.keys(state.projects)
//       .map(p => state.projects[p].id)
//       .filter(id => id === projectToAdd.id)
//       .length
//   ).toEqual(1)
// })

test('addProject adds project to projects', () => {
  mutations.addProject(state, projectToAdd)
  const project = Object.keys(state.projects)
    .map(p => state.projects[p])
    .find(project => project.id === projectToAdd.id)
  expect(project).toEqual(projectToAdd)
})

test('no user logged in at launch', () => {
  expect(getters.isLoggedIn(state)).toBeFalsy()
})

test('login commits to store', () => {
  mutations.login(state, userToAdd)
  expect(state.accountData).toEqual(userToAdd)
})

test('isLoggedIn true after login', () => {
  expect(getters.isLoggedIn(state)).toBeTruthy()
})

test('logout sets accountData to null', () => {
  mutations.logout(state)
  expect(state.accountData).toEqual(null)
})

test('getter gets project by id', () => {
  expect(getters.projectById(state)(1)).toBeTruthy()
})
