<template>
  <div
    id="sprint-card"
    class="ui card">
    <creation-modal
      id="sprint-creation-modal"
      :releases="project.releases"
      :sprints="project.sprints"
      :stories="project.stories"
      :tasks="project.tasks"
    />
    <div class="content">
      <span class="header">
        <span>Current Sprint</span>
        <a
          @click="showModal"
          class="ui right floated animated fade compact button">
          <div class="hidden content">Add</div>
          <div class="visible content">
            <i class="plus icon"/>
          </div>
        </a>
      </span>
    </div>

    <div class="content">
      <div class="ui segments">
        <div class="ui segment">
          <h4 class="ui header">Name: {{ currentSprint.name }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SprintCreationModal from '@/components/Projects/SprintCreationModal'

/* global $ */
export default {
  components: {
    'creation-modal': SprintCreationModal
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentSprint: {
        name: 'Sprint 1',
        startDate: new Date('2018-01-20'),
        endDate: new Date('2018-02-04'),
        stories: {},
        tasks: {}
      },
      sprints: {},
      modal: null
    }
  },
  computed: {
    formattedStartDate: () => this.formatDate(this.startDate),
    formattedEndDate: () => this.formatDate(this.endDate)
  },
  mounted () {
    this.modal = $('#sprint-card #sprint-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')
  },
  methods: {
    formatDate (date) {
      let [year, month, day] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ]

      if (month < 10) {
        month = `0${month}`
      }

      if (day < 10) {
        day = `0${day}`
      }

      return `${year}-${month}-${day}`
    },
    showModal () {
      if (this.modal) {
        this.modal.modal('show')
      }
    }
  }

}

</script>
