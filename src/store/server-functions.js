/* global $ */

class ColiberateFrontendCore {
  setStore (store) {
    this.$store = store
    this.baseUrl = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
  }

  // ex apiUrl = api/projects/sample-project-0/tasks
  postToServer ({ payload, apiUrl }) {
    return new Promise((resolve, reject) => {
      $.post(`${this.baseUrl}/${apiUrl}`, payload)
        .done(resolve).fail(reject)
    })
  }

  // ex apiUrl = api/projects/sample-project-0?member_id=my_id
  putToServer (apiUrl) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${this.baseUrl}/${apiUrl}`,
        type: 'PUT'
      }).done(resolve).fail(reject)
    })
  }

  // ex apiUrl = api/projects/sample-project-0?member_id=my_id
  getFromServer (apiUrl) {
    return new Promise((resolve, reject) => {
      $.get(`${this.baseUrl}/${apiUrl}`)
        .done(resolve).fail(reject)
    })
  }

  // ex apiUrl = api/projects/sample-project-0?member_id=my_id
  deleteFromServer (apiUrl) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${this.baseUrl}/${apiUrl}`,
        type: 'DELETE'
      }).done(resolve).fail(reject)
    })
  }

  get projects () {
    const getSingle = (memberId, projectId) => this.getFromServer(`api/projects/${projectId}?member_id=${memberId}`)
    const getAll = (memberId) => this.getFromServer(`api/projects?member_id=${memberId}`)
    return {
      getSingle,
      getAll,
      updateStore: async (memberId = '') => {
        if (!this.$store) {
          throw Error('No store specified')
        }
        const projectList = await getAll(memberId)
        console.debug('get project list for', memberId, projectList)
        this.$store.commit('updateProjectList', projectList)
      }
    }
  }

  get members () {
    const getSingle = async (memberId) => {
      const response = await this.getFromServer(`api/members/${memberId}`)
      if (response.error) {
        throw Error(response.error)
      }
      return response.data
    }
    const getAll = async () => {
      const response = await this.getFromServer('api/members')
      if (response.error) {
        throw Error(response.error)
      }
      return response.data
    }
    return {
      getSingle,
      getAll,
      updateStore: async () => {
        if (!this.$store) {
          throw Error('No store specified')
        }
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

export default ColiberateFrontendCore
