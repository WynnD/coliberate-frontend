<template>
  <div
    id="projects-page"
    class="ui container">
    <creation-modal id="project-creation-modal"/>
    <remove-modal
      id="project-remove-modal"
      :target-project-id="removeTargetId"
      @update="getProjectList"
    />
    <div
      v-if="$store.getters.isLoggedIn"
      class="ui three stackable raised cards">
      <div
        id="add-project-card"
        class="ui card">
        <a
          class="image"
          @click="showModal('project-create')">
          <button class="ui icon fluid button">
            <div><h1><i class="plus circle icon"/></h1></div>
            <div><h1><b>Add Project</b></h1></div>
          </button>
        </a>
      </div>
      <project-card
        v-for="project in projects"
        :key="project.id"
        @showmodal="showModal"
        :project="project"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ProjectCard from '@/components/Projects/ProjectCard'
import CreationModal from '@/components/Projects/ProjectCreationModal'
import RemoveModal from '@/components/Projects/ProjectRemovalModal'

/* global $ */
export default {
  components: {
    'project-card': ProjectCard,
    'creation-modal': CreationModal,
    'remove-modal': RemoveModal
  },
  data () {
    return {
      modals: {},
      removeTargetId: ''
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
    const modalMapping = {
      'project-create': '#project-creation-modal',
      'project-remove': '#project-remove-modal'
    }

    Object.keys(modalMapping)
      .forEach(modalType => {
        this.modals[modalType] = $(this.$el).find(modalMapping[modalType])
          .modal({
            closable: false,
            onVisible () {
              $(this).modal('refresh')
            }
          }).modal('hide')
      })

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
    showModal (type) {
      this.getMembers()
      console.debug(type, this.modals[type])
      const isRemoveCommand = type.indexOf('remove') > -1 && type.indexOf('|') > -1
      if (this.modals[type] && !isRemoveCommand) {
        this.modals[type].modal('show')
      } else if (isRemoveCommand) {
        const [modalType, target] = type.split('|')
        this.removeTargetId = target
        if (this.modals[modalType]) {
          this.modals[modalType].modal('show')
        }
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
