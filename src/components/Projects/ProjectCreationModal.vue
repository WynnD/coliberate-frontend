<template>
  <div class="ui modal form">
    <div class="header">Add a Project</div>
    <div class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>
          <div class="ui stackable grid">
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name</div>
                <input
                  v-model="project.name"
                  type="text"
                  placeholder="Project Name">
              </div>
            </div>

            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Description</div>
                <input
                  v-model="project.description"
                  type="text"
                  placeholder="Project Description">
              </div>
            </div>
          </div>
        </div>

        <div class="ui segment">
          <div class="ui header">Group Members</div>
          <div class="meta">
            Group and Role Selectors still in development
          </div>
          <ul>
            <li
              v-for="member in project.members"
              :key="member.id">
              <b v-if="member.id === currentUser.id || +member.id === currentUser.id">
                {{ currentUser.name }}
              </b>
              <b v-else-if="memberById(member.id)">
                {{ memberById(member.id).name }}
              </b>
              <b v-else>{{ member.id }}</b>
              - {{ member.role }}
            </li>
          </ul>
        </div>

        <div class="ui segment">
          <div class="ui header">Project Infrastructure</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Start Date</div>
                <input
                  v-model="project.startDate"
                  type="date"
                  placeholder="Start Date">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">End Date</div>
                <input
                  v-model="project.endDate"
                  type="date"
                  placeholder="End Date">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Sprint Length (days)</div>
                <input
                  v-model="project.defaultSprintLength"
                  type="number">
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui error message">
                <div class="header">Error</div>
                <p>An error has occurred</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui green button"
        @click="registerHandler">
        Add
      </button>
      <div class="ui cancel red button">Cancel</div>
    </div>
  </div>
</template>

<script>

import { mapMutations, mapGetters } from 'vuex'

/* global $ */
export default {
  data () {
    return {
      project: {
        name: '',
        description: '',
        startDate: '1970-12-31',
        endDate: '1970-12-31',
        defaultSprintLength: 14,
        members: {}
      },
      $form: null
    }
  },
  computed: {
    defaultStartDate () {
      const date = new Date()
      return this.getFormattedDate(date)
    },
    defaultEndDate () {
      const oneDay = 24 * 60 * 60 * 1000
      // set to two sprint lengths after current start date
      const date = new Date(new Date(this.defaultStartDate).valueOf() + this.project.defaultSprintLength * 2 * oneDay)
      return this.getFormattedDate(date)
    },
    ...mapGetters(['newProjectId', 'currentUser'])
  },

  mounted () {
    this.project.startDate = this.defaultStartDate
    this.project.endDate = this.defaultEndDate
    this.project.members[this.currentUser.id] = {
      id: this.currentUser.id,
      role: 'Scrum Master'
    }

    this.getMembers()

    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.registerHandler()
    })

    // add support for submitting by pressing enter
    // should we have this? It seems like this could be easy to accidentally press
    /*
    this.$form.on('keypress', e => {
      if (e.key === 'Enter') {
        this.registerHandler()
      }
    })
    */
  },

  methods: {
    getFormattedDate (date) {
      let [year, month, day] = [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        (date.getDate()).toString().padStart(2, '0')
      ]
      return `${year}-${month}-${day}`
    },
    showData () {
      // eslint-disable-next-line
      console.debug(this);
    },
    getMembers () {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.get(`${url}/api/members`)
          .done(response => {
            const userID = this.$store.state.accountData.id
            const members = response.data.filter(m => m.id !== userID)

            const memberObject = {}
            members.forEach(m => {
              memberObject[m.id.toString()] = m
            })
            console.debug('Got member data', memberObject)

            this.$store.commit('updateMemberData', memberObject)
            resolve()
          }).fail(reject)
      })
    },
    async registerHandler () {
      const projectData = {
        // could be overwritten in backend, don't worry about it too much
        id: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        name: this.project.name.trim(),
        description: this.project.description.trim(),
        members: this.project.members,
        startDate: this.project.startDate.trim(),
        endDate: this.project.endDate.trim(),
        defaultSprintLength: this.project.defaultSprintLength
      }
      // eslint-disable-next-line
      console.debug("Sending register info:", projectData)

      try {
        const result = await this.register(projectData)
        console.debug(result)

        if (result !== 'OK') {
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        } else {
          this.$form.modal('hide')

          try {
            const memberID = this.$store.state.accountData.id
            const projectList = await this.getProjectList(memberID)
            this.$store.commit('updateProjectList', projectList)
          } catch (err) {
            console.error('Error getting project data', err)
          }

          // disabled, as server assigning project ID can make this lead to erroneous page
          // this.$router.push({ path: `/projects/${projectData.id}` })
        }
      } catch (err) {
        // eslint-disable-next-line
        console.debug("Register failed!", err);
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }
      this.$form.removeClass('loading')
    },

    sendRegisterData (projectData) {
      const apiUrl = 'api/projects'
      const payload = {
        projectData,
        member_id: this.currentUser.id
      }
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/${apiUrl}`, payload)
          .done(resolve).fail(reject)
      })
    },

    async register (projectData = {}) {
      const textFields = ['name', 'description', 'startDate', 'endDate']
      let errorMessage
      console.debug('checking project data', { projectData })
      textFields.forEach(f => {
        if (!errorMessage && (!projectData[f] || projectData[f].toString().trim().length === 0)) {
          errorMessage = { responseJSON: { error: `${f} field is empty` } }
        }
      })

      if (errorMessage) {
        return errorMessage
      }

      this.$form.addClass('loading')
      const response = await this.sendRegisterData(projectData)
      // eslint-disable-next-line
      console.debug('register', { response })
      return response
    },

    getProjectList (id) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.get(`${url}/api/projects?member_id=${id}`)
          .done(response => {
            const list = response

            console.debug('got project response', response, list)
            resolve(list)
          }).fail(reject)
      })
    },

    notifyError (message = 'An error occurred while trying to register') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    ...mapMutations(['addProject']),
    ...mapGetters(['memberById'])
  }
}
</script>
