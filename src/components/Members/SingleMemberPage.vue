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
              :project="project"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/Projects/ProjectCard'
import { mapGetters } from 'vuex'

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
    },
    ...mapGetters(['currentUser'])
  },
  async mounted () {
    this.accountData = this.memberById()(this.memberID.toString())
    await this.getAccountData(this.memberID)

    this.sharedProjects = await this.getSharedProjects(this.accountData.id)
  },
  methods: {
    ...mapGetters(['server']),
    async getAccountData (id) {
      const memberData = await this.server().members.getSingle(id)
      console.debug('got account response', memberData)
      if (memberData.length === 1) {
        this.accountData = memberData[0]
      }
    },
    async getProjectList (id) {
      const projects = await this.server().projects.getAll(id)
      console.debug('got project response', projects)
      return projects
    },
    async getSharedProjects (theirID) {
      let yourProjects
      const yourID = this.currentUser.id

      try {
        yourProjects = await this.getProjectList(yourID)
      } catch (err) { return }

      console.debug('your projects', yourProjects, yourID, theirID)

      const sharedProjects = yourProjects
        // eslint-disable-next-line
        .filter(p => Object.keys(p.members).filter(id => id === theirID).length > 0)

      console.debug('shared projects', sharedProjects)
      return sharedProjects
    },
    ...mapGetters(['memberById'])
  }
}
</script>
