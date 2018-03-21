import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // enable use of Vuex store

// 1 week in ms = 7 days * 24 hr/day * 60 min/hr * 60 sec/min * 1000 ms/sec
const oneDay = 24 * 60 * 60 * 1000
const oneWeek = 7 * oneDay
const currentDate = new Date()

export const state = {
  projects: {
    'sampleproject-0': {
      id: 'sampleproject-0',
      name: 'Sample Project',
      description: 'Project Description. We need to figure out what data goes into projects',
      members: {
        'member-0': {
          id: 'member-0',
          role: 'Scrum Master'
        },
        'member-1': {
          id: 'member-1',
          role: 'Product Owner'
        }
      },
      releases: {
        'release-0': {
          id: 'release-0',
          name: 'Release 0',
          description: 'Our very first release. :)',
          startDate: new Date(currentDate.valueOf() - oneWeek).toDateString(), // e.g. Mon Mar 12 2018
          endDate: new Date(new Date().valueOf() + 3 * oneWeek).toDateString(),
          features: ['feature-0'], // array of feature IDs
          sprints: ['sprint-0'] // array of sprint IDs
        },
        'release-1': {
          id: 'release-1',
          name: 'Release 2.0',
          description: 'It keeps getting better and better',
          startDate: new Date(currentDate.valueOf() + 4 * oneWeek).toDateString(), // e.g. Mon Mar 12 2018
          endDate: new Date(new Date().valueOf() + 7 * oneWeek).toDateString(),
          features: [], // array of feature IDs
          sprints: [] // array of sprint IDs
        }
      },
      sprints: {
        'sprint-0': {
          // goals are defined by associated tasks and stories
          id: 'sprint-0',
          name: 'Sprint 1',
          startDate: new Date(currentDate.valueOf() - oneWeek).toDateString(), // can't be earlier than associated release
          endDate: new Date(new Date().valueOf() + oneWeek).toDateString(), // can't be later than associated release
          stories: ['story-0'], // array of story IDs
          tasks: [] // array of tasks
        },
        'sprint-1': {
          // goals are defined by associated tasks and stories
          id: 'sprint-1',
          name: 'Sprint 2',
          startDate: new Date(currentDate.valueOf() + oneWeek).toDateString(), // can't be earlier than associated release
          endDate: new Date(new Date().valueOf() + 2 * oneWeek).toDateString(), // can't be later than associated release
          stories: [], // array of story IDs
          tasks: [] // array of tasks
        }
      },
      features: {
        'feature-0': {
          id: 'feature-0',
          name: 'Feature Management',
          description: 'Our project will feature the management of features',
          stories: ['story-0'], // array of associated story IDs
          tasks: [] // array of associated task IDs (not associated with stories)
        },
        'feature-1': {
          id: 'feature-1',
          name: 'Task Management',
          description: 'Our project will feature the management of tasks',
          stories: ['story-1'], // array of associated story IDs
          tasks: [] // array of associated task IDs (not associated with stories)
        }
      },
      stories: {
        'story-0': {
          id: 'story-0',
          status: 'todo',
          // progress can be 100%, but doesn't necessarily mean that story is completed
          // for example, didn't generate/assign every task associated with this story
          name: 'Add Feature',
          description: 'Users will be able to add features to our application',
          businessValue: 8,
          // represents urgency/importance to project
          // effort value defined by tasks
          tasks: [] // array of associated task IDs
        },
        'story-1': {
          id: 'story-1',
          status: 'todo',
          // progress can be 100%, but doesn't necessarily mean that story is completed
          // for example, didn't generate/assign every task associated with this story
          name: 'Add Task',
          description: 'Users will be able to add tasks to our application',
          businessValue: 8,
          // represents urgency/importance to project
          // effort value defined by tasks
          tasks: ['task-1'] // array of associated task IDs
        }
      },
      tasks: {
        'task-0': {
          id: 'task-0',
          status: 'todo',
          name: 'Create UI for adding features',
          description: 'See title',
          points: 5,
          takenBy: [] // array of member IDs
        },
        'task-1': {
          id: 'task-1',
          status: 'todo',
          name: 'Create UI for adding tasks',
          description: 'See title',
          points: 5,
          takenBy: [] // array of member IDs
        },
        'task-2': {
          id: 'task-2',
          status: 'in-progress',
          name: 'Generate more tasks for stories',
          description: 'We need more tasks',
          points: 8,
          takenBy: ['member-1']
        },
        'task-3': {
          id: 'task-3',
          status: 'done',
          name: 'create tasks 0 and 1',
          description: 'create tasks for adding UI to features and tasks',
          points: 3,
          takenBy: ['member-0']
        }
      },
      pointHistory: {},
      auditLog: [
        {
          date: new Date(currentDate.valueOf() - oneWeek + oneDay).toGMTString(),
          members: ['member-0', 'member-1'], // array of member IDs involved in logged action
          description: '<b>Big Jeffrey</b> added <b>Little Wendy</b> as a <b>Product Owner</b>' // probably generated server side based on what's changed
        },
        {
          date: new Date(currentDate.valueOf() - oneWeek).toGMTString(),
          members: ['member-0'], // array of member IDs involved in logged action
          description: 'Project Created by <b>Big Jeffrey</b>' // probably generated server side based on what's changed
        }
      ],
      sprintLength: 14
    }
  },
  members: {
    'member-0': {
      id: 'member-0',
      name: 'Big Jeffrey',
      description: `I'm big, and I'm Jeffrey. Get used to it.`,
      joinDate: '2018-02-25',
      skills: {
        name: 'Java',
        interested: true, // boolean indicating whether or not the user is interested in learning with this
        experience: 0 // 0 - no experience, 1 - some experience, 2 - high level experience
      }
    },
    'member-1': {
      id: 'member-1',
      name: 'Little Wendy',
      description: `I'm little, and I'm Wendy. Get used to it.`,
      joinDate: '2018-02-26',
      skills: {
        name: 'C++',
        interested: true, // boolean indicating whether or not the user is interested in learning with this
        experience: 2 // 0 - no experience, 1 - some experience, 2 - high level experience
      }
    }
  },
  accountData: null,
  developmentMode: false
}

export const getters = {
  projectIds: state => Object.keys(state.projects),
  newProjectId: state => Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
  projectById: state => id => state.projects[id],
  isLoggedIn: state => !!state.accountData,
  isDevelopmentMode: state => !!state.developmentMode,
  currentUser: state => state.accountData,
  memberById: state => id => state.members[id]
}

export const mutations = {
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

export default new Vuex.Store({
  state,
  getters,
  mutations
})
