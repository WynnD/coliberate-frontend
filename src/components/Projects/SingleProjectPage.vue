<template>
  <div
    id="project-page"
    class="ui container">
    <div
      class="ui text one column grid"
      id="project-summary">
      <div class="column">
        <h2 class="header" id="project-name">{{ name }}</h2>
        <span class="header" id="project-description">{{ description }}</span>
      </div>
    </div>
    <div class="ui divider"/>
    <div class="ui three stackable raised cards">
      <div class="ui card">
        <div class="content">
          <span class="header">Overview</span>
        </div>
        <div class="content">
          <span class="ui sub header">Status</span>
          <div class="ui small feed">
            <div class="content">
              <div class="summary">
                Text goes here
              </div>
            </div>
          </div>
        </div>
        <activity-list :activities="activities"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActivityList from '@/components/Projects/ActivityList'

export default {
  components: {
    'activity-list': ActivityList
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
