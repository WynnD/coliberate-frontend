<template>
  <div
    id="project-page"
    class="ui container">
    <div
      id="info-detail-menu"
      class="ui two item menu">
      <a
        @click="view = 'general'"
        :class="{
          item: true,
          active: view === 'general'
      }">
        <span class="ui header medium">General Info</span>
      </a>
      <a
        @click="view = 'details'"
        :class="{
          item: true,
          active: view === 'details'
      }">
        <span class="ui header medium">Details</span>
      </a>
    </div>

    <div v-if="project.name === undefined">
      Loading project data. Please wait.
    </div>
    <div
      v-else
      id="tab-container">
      <general-tab
        v-show="view === 'general'"
        :project="project"/>
      <details-tab
        @update="getProjectData"
        v-show="view === 'details'"
        :project="project"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GeneralTab from '@/components/Projects/GeneralTab'
import DetailsTab from '@/components/Projects/DetailsTab'

export default {
  components: {
    'general-tab': GeneralTab,
    'details-tab': DetailsTab
  },
  data () {
    return {
      view: 'general',
      project: {}
    }
  },
  computed: {
    projectId () {
      return this.$route.params.id
    }
  },
  async mounted () {
    this.project = this.projectById()(this.projectId) || {}

    // case when project ID is a number
    if (!isNaN(this.projectId) && Object.keys(this.project).length === 0) {
      this.project = this.projectById()(+this.projectId) || {}
    }

    try {
      this.project = await this.getProjectData(this.currentUser().id)
      await this.getMembers()
    } catch (err) {
      console.error(err)
    }
    console.debug(this.project)
  },
  methods: {
    async getProjectData () {
      const id = this.currentUser().id
      const projectData = await this.server().projects.getSingle(id, this.projectId)
      console.debug('got project data', projectData)
      this.project = projectData
      return projectData
    },
    getMembers () {
      return this.server().members.updateStore()
    },
    ...mapGetters(['projectById', 'currentUser', 'server'])
  }
}
</script>

<style>
#project-page #tab-container {
  padding-bottom: 1rem;
}
</style>
