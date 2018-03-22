<template>
  <div
    id="general-tab"
    class="ui container">
    <div
      id="project-summary"
      class="ui text segment clearing raised">
      <h1
        id="project-name"
        class="ui header floated left">
        {{ project.name }}
        <div class="sub header">{{ project.description }}</div>
      </h1>
      <h3 class="ui header right floated aligned">
        Start Date: {{ startDate }}
      </h3>
    </div>

    <overview-card
      :project="project"
      class="ui fluid raised card"/>

    <div class="ui two stackable raised cards">
      <team-card :project="project"/>
    </div>
  </div>
</template>

<script>
import TeamCard from '@/components/Projects/Cards/TeamCard'
import OverviewCard from '@/components/Projects/Cards/OverviewCard'

export default {
  components: {
    'overview-card': OverviewCard,
    'team-card': TeamCard
  },
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  computed: {
    startDate () {
      if (this.project.auditLog) {
        return new Date(this.project.auditLog[this.project.auditLog.length - 1].date).toDateString()
      }
      return new Date().toDateString()
    }
  }
}
</script>
