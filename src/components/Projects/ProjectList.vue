<template>
  <div
    id="projects-page"
    class="ui container">
    <creation-modal id="project-creation-modal"/>
    <div class="ui three stackable raised cards">
      <div
        class="ui card"
        id="add-project-card">
        <a
          class="image"
          @click="showModal">
          <button class="ui icon fluid button">
            <div><h1><i class="plus circle icon"/></h1></div>
            <div><h1><b>Add Project</b></h1></div>
          </button>
        </a>
      </div>
      <project-card
        v-for="project in projectData"
        :key="project.name"
        :project-data="project"/>
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/Projects/ProjectCard'
import CreationModal from '@/components/Projects/ProjectCreationModal'

/* global $ */
export default {
  components: {
    'project-card': ProjectCard,
    'creation-modal': CreationModal
  },
  props: {
    projectData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modal: null
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

    this.modal = $('#projects-page #project-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')
  },
  methods: {
    showModal () {
      if (this.modal) {
        this.modal.modal('show')
      }
    }
  }
}
</script>

<style scoped>
#projects-page #add-project-card a.image,
#projects-page #add-project-card button {
  height: 100%;
}
</style>
