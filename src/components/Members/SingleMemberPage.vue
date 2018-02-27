<template>
  <div>
    <div v-if="!accountData">No data found for {{ $route.params.id }}</div>
    <div
      v-else
      class="ui container">
      <div class="ui segments">
        <div class="ui segment">
          <h1 class="ui header">
            {{ accountData.name }}
            <div class="sub header">{{ accountData.email }}</div>
          </h1>
        </div>
        <div class="ui segment">
          <h2 class="ui header">Shared Projects</h2>
          <div
            v-if="sharedProjects.length === 0"
            class="ui message">
            You share no projects with {{ accountData.name }}
          </div>
          <div
            v-else
            class="ui centered cards">
            <project-card
              v-for="project in sharedProjects"
              :key="project.name"
              :project-data="project"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/Projects/ProjectCard'

/* global $ */
export default {
  components: {
    'project-card': ProjectCard
  },
  data () {
    return {
      accountData: null,
      sharedProjects: []
    }
  },
  computed: {
    memberID () {
      return this.$route.params.id
    }
  },
  async mounted () {
    this.accountData = this.$store.state.memberData[this.memberID.toString()]
    await this.getAccountData(this.memberID)

    this.sharedProjects = await this.getSharedProjects(this.accountData.id)
  },
  methods: {
    getAccountData (id) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.get(`${url}/api/members/${id}`)
          .done(response => {
            const list = response.data

            console.debug('got account response', list)
            if (list.length === 1) {
              this.accountData = list[0]
              resolve()
            }
          }).fail(reject)
      })
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
    async getSharedProjects (theirID) {
      let yourProjects
      const yourID = this.$store.state.accountData.id

      try {
        yourProjects = await this.getProjectList(yourID)
      } catch (err) { return }

      const sharedProjects = yourProjects
        // eslint-disable-next-line
        .filter(p => p.members.filter(m => m.memberID == theirID).length > 0)

      console.debug('shared projects', sharedProjects)
      return sharedProjects
    }
  }
}
</script>
