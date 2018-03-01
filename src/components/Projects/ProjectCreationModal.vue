<template>
  <div class="ui modal form">
    <div class="header">Add a Project</div>
    <div class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name</div>
                <input
                  v-model="project.name"
                  type="text"
                  placeholder="Project Name">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">ID</div>
                <div class="ui basic button disabled">
                  {{ project.id }}
                </div>
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
              <b v-if="member.id === currentUser.id">
                {{ currentUser.name }}
              </b>
              <b v-else-if="memberById(member.id)">
                {{ memberById(member.id).name }}
              </b>
              <b v-else> {{ member.id }}</b> - {{ member.role }}
            </li>
          </ul>
        </div>

        <div class="ui segment">
          <div class="ui header">Project Infrastructure</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Predicted Start Date</div>
                <input
                  v-model="project.startdate"
                  type="date"
                  placeholder="Start Date">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Sprint Length (days)</div>
                <input
                  v-model="project.sprintLength"
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
        id: 0,
        name: '',
        description: '',
        activities: [],
        stories: [],
        members: [],
        startdate: '1970-12-31',
        sprintLength: 14
      },
      $form: null
    }
  },
  computed: {
    currentDate () {
      const date = new Date()
      let [year, month, day] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ]

      if (month < 10) {
        month = `0${month}`
      }

      if (day < 10) {
        day = `0${day}`
      }

      return `${year}-${month}-${day}`
    },
    ...mapGetters(['newProjectId', 'currentUser'])
  },

  mounted () {
    this.project.id = this.newProjectId
    this.project.startDate = this.currentDate
    this.project.members.push({
      memberID: this.$store.state.accountData.id,
      role: 'Scrum Master'
    })

    this.getMembers()

    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.registerHandler()
    })

    // add support for submitting by pressing enter
    this.$form.on('keypress', e => {
      if (e.key === 'Enter') {
        this.registerHandler()
      }
    })
  },

  methods: {
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
        name: this.project.name.trim(),
        id: this.project.id,
        description: this.project.description.trim(),
        members: this.project.members,
        startdate: this.project.startdate,
        sprintLength: this.project.sprintLength
      }
      // eslint-disable-next-line
      console.debug("Sending register info:", projectData)

      try {
        const result = await this.register(projectData)

        if (result.status !== 200) {
          // eslint-disable-next-line
          console.debug("Register failed!", result);
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        } else {
          this.$form.modal('hide')
          this.$router.push({ path: `/projects/${projectData.id}` })
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
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/api/projects`, { projectData })
          .done(resolve).fail(reject)
      })
    },

    async register (projectData = {}) {
      const textFields = ['name', 'id', 'description', 'startdate']
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
      const data = await this.sendRegisterData(projectData)
      // eslint-disable-next-line
      console.debug('register', { data })
      return data
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
