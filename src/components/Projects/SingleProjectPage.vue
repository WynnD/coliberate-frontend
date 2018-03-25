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
      <sprint-card
        v-if="project.sprints"
        :project="project"/>
      <team-card
        v-if="project.members"
        :project="project"/>
      <feature-card
        v-if="project.features"
        :project="project"/>
        <!-- TODO: Cards for stories, tasks, sprints -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TeamCard from '@/components/Projects/Cards/TeamCard'
import OverviewCard from '@/components/Projects/Cards/OverviewCard'
import SprintCard from '@/components/Projects/Cards/SprintCard'
import FeatureCard from '@/components/Projects/Cards/FeatureCard'

/* global $ */
export default {
  components: {
    'overview-card': OverviewCard,
    'team-card': TeamCard,
    'sprint-card': SprintCard,
    'feature-card': FeatureCard
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
      if (this.project.auditLog) {
        return new Date(this.project.auditLog[this.project.auditLog.length - 1].date).toDateString()
      }
      return new Date().toDateString()
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
    } catch (err) {
      console.error(err)
    }
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
