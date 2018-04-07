<template>
  <div class="ui activity-card card">
    <div
      class="content"
      id="header-container">
      <span class="header">Recent Activity</span>
    </div>
    <div class="content">
      <activity-list :activities="project.auditLog"/>
    </div>
  </div>
</template>

<script>
import ActivityList from '@/components/Projects/ActivityList'

export default {
  components: {
    'activity-list': ActivityList
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.ui.card .content#header-container {
  max-height: 3.5rem;
}
</style>
