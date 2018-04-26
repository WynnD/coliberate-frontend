<template>
  <div
    id="projects-page"
    class="ui container">
    <creation-modal id="project-creation-modal"/>
    <div
      v-if="$store.getters.isLoggedIn"
      class="ui three stackable raised cards">
      <div
        id="add-project-card"
        class="ui card">
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
import { mapState, mapGetters } from 'vuex'
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
      modals: {}
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

    this.modals['project-create'] = $('#projects-page #project-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')

    try {
      const memberID = this.$store.state.accountData.id
      await this.getProjectList(memberID)
    } catch (err) {
      console.error('Error getting project data', err)
    }

    try {
      await this.getMembers()
    } catch (err) {
      console.error('Error trying to get member list', err)
    }
  },
  methods: {
    ...mapGetters(['server']),
    showModal () {
      this.getMembers()
      if (this.modals['project-create']) {
        this.modals['project-create'].modal('show')
      }
    },
    getProjectList (id) {
      return this.server().projects.updateStore(id)
    },
    getMembers () {
      return this.server().members.updateStore()
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
