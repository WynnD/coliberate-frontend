<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">
    <section slot="header">Remove Project Confirmation</section>
    <section slot="content">
      <div v-if="project">
        <h3>Are you sure you want to remove "{{ project.name }}"?</h3>
        <p><b>Start Date: </b> {{ startDate }} ({{ dateDifference }})</p>
        <p><b>Description: </b> {{ project.description }}</p>
        <p><b>Member List: </b></p>
        <ul>
          <li
            v-for="member in project.members"
            :key="member.id"
          >
            {{ getMember(member.id).name }} - {{ member.role }}
          </li>
        </ul>
      </div>
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
      project: null
    }
  },
  computed: {
    ...mapGetters(['projectById', 'currentUser', 'server', 'dateFunctions', 'memberById']),
    startDate () {
      if (this.project && this.project.auditLog) {
        return new Date(this.project.auditLog[this.project.auditLog.length - 1].date).toLocaleString()
      }
      return new Date().toLocaleString()
    },
    dateDifference () {
      return this.dateFunctions.getRelativeDateDifferenceMessage(new Date(this.startDate), ['millisecond'])
    },
    apiUrl () {
      return `api/projects/${this.targetProjectId}?member_id=${this.currentUser.id}`
    }
  },
  watch: {
    async targetProjectId (newValue) {
      this.activeAccordion = ''
      this.$form.removeClass('error')
      this.refreshModal()
      this.project = null
      await this.getProjectData()
      this.refreshModal()
    }
  },
  async mounted () {
    this.$form = $(this.$el)
    await this.getProjectData()
    this.refreshModal()
  },
  methods: {
    async getProjectData () {
      if (!this.targetProjectId) {
        console.debug('target project ID is empty')
        this.project = null
        return
      }
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
      console.debug({ project: this.project, id: this.targetProjectId })
    },
    async getProjectDataFromServer (accountId) {
      const projectData = await this.server.projects.getSingle(accountId, this.targetProjectId)
      console.debug('got project data', projectData)
      this.project = projectData
      return projectData
    },
    getMembers () {
      return this.server.members.updateStore()
    },
    getMember (id) {
      return this.memberById(id)
    },
    refreshModal () {
      setTimeout(() => {
        this.$form.modal('refresh')
      }, 50)
    }
  }
}
</script>
