<template>
  <div class="ui card">
    <div class="content">
      <div class="header">{{ project.name }}</div>
    </div>
    <div class="content">
      <h4 class="ui sub header"><b>About</b></h4>
      <div class="ui small feed">
        <div class="event">
          <div class="content">
            <div class="summary">
              {{ project.description }}
            </div>
          </div>
        </div>
      </div>
      <div class="ui divider"/>
    </div>
    <activity-list :activities="project.activities"/>
    <div class="extra content">
      <router-link
        :to="routerLink"
        class="ui button">Open Project</router-link>
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
  },
  computed: {
    routerLink () {
      return `/projects/${this.project.id}`
    },
    activitiesList () {
      return this.project.activities
    }
  },
  created () {
    console.debug(this.project.activities)
  }
}
</script>
