<template>
  <div
    id="project-page"
    class="ui container">
    <div
      class="ui text segment grid raised"
      id="project-summary">
      <div class="column">
        <h2 class="header" id="project-name">{{ name }}</h2>
        <span class="header" id="project-description">{{ description }}</span>
      </div>
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
      return Number(this.$route.params.id)
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
  mounted () {
    this.project = this.projectById()(this.projectId)
  },
  methods: {
    ...mapGetters(['projectById'])
  }
}
</script>
