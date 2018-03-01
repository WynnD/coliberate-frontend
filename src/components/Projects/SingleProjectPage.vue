<template>
  <div
    id="project-page"
    class="ui container">
    <div
      id="project-summary"
      class="ui text segment raised">
      <h2
        id="project-name"
        class="header">
        {{ name }}
      </h2>
      <span
        id="project-description"
        class="header">
        {{ description }}
      </span>
    </div>
    <div class="ui three stackable raised cards">
      <overview-card :project="project"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActivityList from '@/components/Projects/ActivityList'
import OverviewCard from '@/components/Projects/Cards/OverviewCard'

/* global $ */
export default {
  components: {
    'activity-list': ActivityList,
    'overview-card': OverviewCard
  },
  data () {
    return {
      project: {}
    }
  },
  computed: {
    projectId () {
      return this.$route.params.id
    },
    name () {
      return this.project.name
    },
    description () {
      return this.project.description
    },
    activities () {
      return this.project.activities
    }
  },
  async mounted () {
    this.project = this.projectById()(this.projectId) || {}

    // case when project ID is a number
    if (!isNaN(this.projectId) && Object.keys(this.project).length === 0) {
      this.project = this.projectById()(+this.projectId) || {}
    }

    this.project = await this.getProjectData(this.currentUser().id)
  },
  methods: {
    getProjectData (id) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.get(`${url}/api/projects/${this.projectId}?member_id=${id}`)
          .done(response => {
            const list = response

            console.debug('got project response', response, list)
            resolve(list[0])
          }).fail(reject)
      })
    },
    ...mapGetters(['projectById', 'currentUser'])
  }
}
</script>
