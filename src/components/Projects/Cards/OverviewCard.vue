<template>
  <div class="ui card">
    <div class="content">
      <span class="header">Overview</span>
    </div>
    <project-summary/>
    <activity-list :activities="activities"/>
  </div>
</template>

<script>
import ActivityList from '@/components/Projects/ActivityList'
import ProjectSummary from '@/components/Projects/ProjectSummary'

export default {
  components: {
    'activity-list': ActivityList,
    'project-summary': ProjectSummary
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    activities () {
      return this.project.activities
    }
  }
}
</script>
