<template>
  <remove-modal
    @update="updateProjectStore"
    :api-url="apiUrl">
    <section slot="header">Remove Project Confirmation</section>
    <section slot="content">
      {{ project }}
    </section>
  </remove-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import RemoveModal from '@/components/RemoveModal'

/* global $ */
export default {
  components: {
    'remove-modal': RemoveModal
  },
  props: {
    targetProjectId: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      $form: null,
      project: null,
    }
  },
  computed: {
    ...mapGetters(['projectById', 'currentUser', 'server']),
    apiUrl () {
      return `api/projects/${this.targetProjectId}?member_id=${this.currentUser.id}`
    }
  },
  async mounted () {
    this.getProjectData()
  },
  watch: {
    targetProjectId () {
      this.project = null
      this.getProjectData()
    }
  },
  methods: {
    async getProjectData () {
      this.project = this.projectById(this.targetProjectId)

      // case when project ID is a number
      if (!isNaN(this.projectId) && Object.keys(this.project).length === 0) {
        this.project = this.projectById(+this.targetProjectId)
      }

      try {
        this.project = await this.getProjectDataFromServer(this.currentUser.id)
        await this.getMembers()
      } catch (err) {
        console.error(err)
      }
      console.debug(this.project)
    },
    async getProjectDataFromServer (id) {
      const projectData = await this.server.projects.getSingle(id, this.projectId)
      console.debug('got project data', projectData)
      this.project = projectData
      return projectData
    },
    getMembers () {
      return this.server.members.updateStore()
    }
  }
}
</script>
