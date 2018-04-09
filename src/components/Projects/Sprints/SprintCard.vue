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
    <div
      id="sprint-card-header"
      class="content">
      <div class="header ui grid">
        <select
          v-model="currentSprintId"
          class="ui inline selection dropdown">
          <option value="">Select a Sprint...</option>
          <option
            v-for="sprint in project.sprints"
            :key="sprint.id"
            :value="sprint.id"
          >
            {{ sprint.name }}
          </option>
        </select>
        <a
          @click="showModal"
          class="ui right floated animated fade compact button">
          <div class="hidden content">Add</div>
          <div class="visible content">
            <i class="plus icon"/>
          </div>
        </a>
      </div>
    </div>

    <div class="content">
      <div
        v-if="currentSprint"
        class="ui segments">
        <div class="ui segment">
          <div>
            <b>Start Date:</b>
            <span>{{ getFormattedDate(new Date(currentSprint.startDate)) }}</span>
            <span>({{ getDateDifference(currentDate, new Date(currentSprint.startDate)) }})</span>
          </div>
          <div>
            <b>End Date:</b>
            <span>{{ getFormattedDate(new Date(currentSprint.endDate)) }}</span>
            <span>({{ getDateDifference(currentDate, new Date(currentSprint.endDate)) }})</span>
          </div>
        </div>
        <div class="ui segment">
          <div class="ui horizontal segments">
            <div class="ui segment">
              <span>{{ currentSprint.stories.length }}</span>
              <span>{{ currentSprint.stories.length === 1 ? 'story' : 'stories' }}</span>
            </div>
            <div class="ui segment">
              <span>{{ currentSprint.tasks.length }}</span>
              <span>{{ currentSprint.tasks.length === 1 ? 'task' : 'tasks' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SprintCreationModal from './SprintCreationModal'

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
      currentSprintId: '',
      modal: null
    }
  },
  computed: {
    currentSprint () {
      // TODO: Base it off of current release?
      return this.project.sprints[this.currentSprintId]
    },
    currentDate: () => new Date()
  },
  mounted () {
    this.modal = $('#sprint-card #sprint-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')

    $('#sprint-card #sprint-card-header .dropdown').dropdown()
  },
  methods: {
    getFormattedDate (date) {
      let [year, month, day] = [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        (date.getDate()).toString().padStart(2, '0')
      ]

      return `${year}-${month}-${day}`
    },
    getDateDifference (older, newer, valuesOnly = false) {
      const difference = new Date(Math.abs(newer - older))
      const attributes = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }

      const ignoredAttributes = ['hour', 'minute', 'second', 'millisecond']

      // conversion from this to milliseconds
      const constants = {
        millisecond: 1,
        second: 1000,
        minute: 1000 * 60,
        hour: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24
      }

      const divide = (numerator, denominator) => {
        return {
          quotient: parseInt(numerator / denominator),
          remainder: numerator % denominator
        }
      }

      // convert time in ms to various attributes
      let total = difference.getTime()
      Object.keys(attributes)
        .forEach((attr) => {
          if (total > constants[attr]) {
            const result = divide(total, constants[attr])
            attributes[attr] = result.quotient
            total = result.remainder
          }
        })

      const msg = Object.keys(attributes)
        .filter(attr => ignoredAttributes.indexOf(attr) === -1 && attributes[attr] > 0)
        .map(attr => {
          const value = attributes[attr]
          return `${value} ${value === 1 ? attr : `${attr}s`}`
        }).join(', ')

      return !valuesOnly ? `${msg} ${newer - older < 0 ? 'ago' : 'from now'}` : attributes
    },
    showModal () {
      if (this.modal) {
        this.modal.modal('show')
      }
    }
  }

}

</script>

<style>
#sprint-card #sprint-card-header {
  max-height: 3.5rem;
  margin-bottom: 0.1rem;
  margin-right: 0.5rem;
}

#sprint-card #sprint-card-header .dropdown {
  border: none;
  padding-bottom: 0;
  margin-top: -0.75rem;
}
</style>
