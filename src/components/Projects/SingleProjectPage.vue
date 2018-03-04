<template>
  <div
    id="project-page"
    class="ui container">
    <div
      id="project-summary"
      class="ui text segment clearing raised">
      <h1
        id="project-name"
        class="ui header floated left">
        {{ name }}
        <div class="sub header">{{ description }}</div>
      </h1>
      <h3 class="ui header right floated aligned">
        Start Date: {{ startDate }}
      </h3>
    </div>
    <div class="ui three stackable raised cards">
      <overview-card :project="project"/>
      <team-card :project="project"/>
      <!-- TODO: Cards for stories, tasks, sprints -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TeamCard from '@/components/Projects/Cards/TeamCard'
import OverviewCard from '@/components/Projects/Cards/OverviewCard'

/* global $ */
export default {
  components: {
    'overview-card': OverviewCard,
    'team-card': TeamCard
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
    },
    startDate () {
      return this.project.startDate
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
