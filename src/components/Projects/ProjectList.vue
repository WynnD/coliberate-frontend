<template>
  <div
    id="projects-page"
    class="ui container">
    <creation-modal id="project-creation-modal"/>
    <div
      v-if="$store.getters.isLoggedIn"
      class="ui three stackable raised cards">
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
        v-for="project in projects"
        :key="project.id"
        :project="project"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProjectCard from '@/components/Projects/ProjectCard'
import CreationModal from '@/components/Projects/ProjectCreationModal'

/* global $ */
export default {
  components: {
    'project-card': ProjectCard,
    'creation-modal': CreationModal
  },
  data () {
    return {
      modal: null
    }
  },
  computed: mapState([
    'projects'
  ]),
  watch: {
    projects (newValue) {
      // eslint-disable-next-line
      console.debug("projects", newValue);
    }
  },
  async mounted () {
    // eslint-disable-next-line
    //console.debug(this.projects);

    this.modal = $('#projects-page #project-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')

    try {
      const memberID = this.$store.state.accountData.id
      const projectList = await this.getProjectList(memberID)
      this.$store.commit('updateProjectList', projectList)
    } catch (err) {
      console.error('Error getting project data', err)
    }
  },
  methods: {
    showModal () {
      if (this.modal) {
        this.modal.modal('show')
      }
    },
    getProjectList (id) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.get(`${url}/api/projects?member_id=${id}`)
          .done(response => {
            const list = response

            console.debug('got project response', response, list)
            resolve(list)
          }).fail(reject)
      })
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
