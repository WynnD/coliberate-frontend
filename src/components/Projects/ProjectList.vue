<template>
  <div
    id="projects-page"
    class="ui container">
    <div v-if="Object.keys(this.$store.state.projectData) === 0">
      No project data loaded.
    </div>
    <div
      v-else
      class="ui three stackable cards">
      <project-card
        v-for="project in this.$store.state.projectData"
        :key="project.name"
        :project-data="project"/>
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/Projects/ProjectCard'

export default {
  components: {
    'project-card': ProjectCard
  },
  props: {},
  watch: {
    projectData (newValue) {
      // eslint-disable-next-line
      console.log("projectData", newValue);
    }
  },
  mounted () {
    // eslint-disable-next-line
    console.log(this.$store.projectData);
  }
}
</script>
