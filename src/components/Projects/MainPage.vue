<template>
  <div
    id="projects-page"
    class="ui container">
    <div v-if="Object.keys(projectData) === 0">
      No project data loaded.
    </div>
    <div
      v-else
      class="ui three stackable cards">
      <project-card
        v-for="project in projectData"
        :key="project.name"/>
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/Projects/ProjectCard'

export default {
  components: {
    'project-card': ProjectCard
  },
  props: {
    projectData: {
      type: Object,
      required: true
    }
  },
  watch: {
    projectData (newValue) {
      // eslint-disable-next-line
      console.log("projectData", newValue);
    }
  },
  mounted () {
    // eslint-disable-next-line
    console.log(this.projectData);
  }
}
</script>
