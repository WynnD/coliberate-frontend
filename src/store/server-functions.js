/* global $ */

class ColiberateFrontendCore {
  constructor (store, isDevelopmentMode = false) {
    this.$store = store
    this.isDevelopmentMode = isDevelopmentMode
  }

  // ex apiUrl = api/projects/sample-project-0/tasks
  postToServer ({ payload, apiUrl }) {
    return new Promise((resolve, reject) => {
      const url = this.isDevelopmentMode ? 'http://localhost' : ''
      $.post(`${url}/${apiUrl}`, payload)
        .done(resolve).fail(reject)
    })
  }

  // ex apiUrl = api/projects/sample-project-0?member_id=my_id
  getFromServer (apiUrl) {
    return new Promise((resolve, reject) => {
      const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
      $.get(`${url}/${apiUrl}`)
        .done(resolve).fail(reject)
    })
  }

  get projects () {
    const getSingle = (memberId, projectId) => this.getFromServer(`api/projects/${projectId}?member_id=${memberId}`)
    const getAll = (memberId) => this.getFromServer(`/api/projects?member_id=${memberId}`)
    return {
      getSingle,
      getAll,
      updateStore: async (memberId = '') => {
        const projectList = await getAll(memberId)
        console.debug('get project list for', memberId, projectList)
        this.$store.commit('updateProjectList', projectList)
      }
    }
  }

  get members () {
    const getSingle = (memberId) => this.getFromServer(`api/members/${memberId}`)
    const getAll = () => this.getFromServer('api/members')
    return {
      getSingle,
      getAll,
      updateStore: async () => {
        const memberList = await getAll()
        const memberObject = {}
        memberList.forEach(m => {
          memberObject[m.id.toString()] = m
        })
        console.debug('got member data', memberObject)
        this.$store.commit('updateMemberData', memberObject)
      }
    }
  }
}

module.exports = ColiberateFrontendCore
