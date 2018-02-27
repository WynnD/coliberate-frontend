<template>
  <div class="ui modal">
    <div class="header">Add a Project</div>
    <div class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>

          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name:</div>
                <input
                  type="text"
                  v-model="project.name"
                  placeholder="Project Name">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">ID:</div>
                <div class="ui basic button disabled">
                  {{ project.id }}
                </div>
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Description:</div>
                <input
                  type="text"
                  v-model="project.desc"
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
              <b v-if="member.id === $store.state.accountData.id">
                {{ $store.state.accountData.name }}
              </b>
              <b v-else-if="$store.state.memberData[member.id]">
                {{ $store.state.memberData[member.id].name }}
              </b>
              <b v-else> {{ member.id }}</b> -
              {{ member.role }}
            </li>
          </ul>
        </div>

        <div class="ui segment">
          <div class="ui header">Project Infrastructure</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Predicted Start Date:</div>
                <input
                  type="date"
                  v-model="project.start_date"
                  placeholder="Start Date">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Default Sprint Length:</div>
                <input
                  type="number"
                  v-model="project.sprintLength">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div
        @click="showData"
        class="ui approve green button">
        Add
      </div>
      <div class="ui cancel red button">Cancel</div>
    </div>
  </div>
</template>

<script>
/* global $ */
export default {
  data () {
    return {
      project: {
        name: 'Project Name',
        id: 'Project ID',
        description: 'Project Description',
        members: [],
        startdate: '1970-12-31',
        sprintLength: 14,
        releases: [],
        sprints: [],
        tasks: []
      }
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
    defaultProject () {
      return {
        name: 'Project Name',
        id: 0,
        desc: 'Project Description',
        members: [],
        startDate: '1970-12-31',
        sprintLength: 14
      }
    }
  },
  watch: {
    'project.name': function (newValue) {
      this.project.id = newValue.replace(/ /g, '-')
    }
  },
  mounted () {
    this.project.startDate = this.currentDate
    this.project.members.push({
      id: this.$store.state.accountData.id,
      role: 'Scrum Master'
    })

    this.getMembers()
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
    }
  }
}
</script>
