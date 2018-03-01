<template>
  <div class="ui card">
    <div class="content">
      <div class="header">{{ name }}</div>
    </div>
    <div class="content">
      <h4 class="ui sub header"><b>About</b></h4>
      <div class="ui small feed">
        <div class="event">
          <div class="content">
            <div class="summary">
              {{ description }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <activity-list :activities="activities"/>
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
  }
}
</script>
