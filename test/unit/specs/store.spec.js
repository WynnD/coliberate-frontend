import {state, getters, mutations} from '@/store'

const projectToAdd = {id: 1}
const userToAdd = {id: 2}

test('addProject adds project id to projectList', () => {
  mutations.addProject(state, projectToAdd)
  expect(state.projectList.find(id => id === 1)).toBeTruthy()
})

test('addProject adds project to projects', () => {
  const project = state.projects.find(project => project.id === 1)
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
