<template>
  <div class="ui modal form">
    <div class="header">Add a Sprint</div>
    <div
      id="sprint-modal-content"
      class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>
          <div class="ui stackable grid">
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name</div>
                <input
                  v-model="sprint.name"
                  type="text"
                  placeholder="Sprint Name">
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Release</div>
                <select
                  v-model="associatedRelease"
                  class="ui fluid dropdown">
                  <option
                    disabled
                    value="">
                    Select a Release
                  </option>
                  <option
                    v-for="release in releases"
                    :key="release.id"
                    :value="release.id"
                  >
                    {{ release.name }} ({{ getDateRange(release) }})
                  </option>
                </select>
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Start Date</div>
                <input
                  v-model="sprint.startDate"
                  type="date"
                  placeholder="Start Date">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">End Date</div>
                <input
                  v-model="sprint.endDate"
                  type="date"
                  placeholder="Start Date">
              </div>
            </div>
            <div class="sixteen wide colu">
              <div class="label">
                Sprint length is {{ getDateDifference(new Date(sprint.startDate), new Date(sprint.endDate)) }}
              </div>
            </div>
          </div>
        </div>

        <div
          id="selection-section"
          class="ui segment">
          <div class="ui header">Story/Task Selection</div>
          <div class="meta">
            <h4 class="header">
              Stories ({{ numSelectedStories }}/{{ Object.keys(stories).length }} added)
            </h4>
            <div class="ui three column stackable grid">
              <div
                v-for="story in stories"
                :key="story.id"
                class="column">
                <story-card :story="story">
                  <div
                    id="toggle-btn"
                    @click="toggleStory(story.id)"
                    class="ui fluid button checkbox">
                    <input
                      type="checkbox"
                      :value="story.id"
                      v-model="selectedStories[story.id]">
                    <label>Add to sprint</label>
                  </div>
                </story-card>
              </div>
            </div>
          </div>
          <h4 class="header">
            Tasks ({{ numSelectedTasks }}/{{ Object.keys(tasks).length }} added)
          </h4>
          <div class="ui three column stackable grid">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="column">
              <task-card :task="task">
                <div
                  id="toggle-btn"
                  @click="toggleTask(task.id)"
                  class="ui fluid button checkbox">
                  <input
                    type="checkbox"
                    :value="task.id"
                    v-model="selectedTasks[task.id]">
                  <label>Add to sprint</label>
                </div>
              </task-card>
            </div>
          </div>
          <div class="ui error message">
            <div class="header">Error</div>
            <p>An error has occurred</p>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui green button"
        @click="registerClickHandler">
        Add
      </button>
      <div class="ui cancel red button">Cancel</div>
    </div>
  </div>
</template>

<script>
import SingleStoryCard from '@/components/Projects/Stories/SingleStoryCard'
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import { mapMutations, mapGetters } from 'vuex'

/* global $ */
export default {
  components: {
    'story-card': SingleStoryCard,
    'task-card': SingleTaskCard
  },
  props: {
    releases: {
      required: true,
      type: Object
    },
    initialRelease: {
      required: false,
      type: String,
      default: ''
    },
    sprints: {
      required: true,
      type: Object
    },
    stories: {
      required: true,
      type: Object
    },
    tasks: {
      required: true,
      type: Object
    },
    projectId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      sprint: {
        name: '',
        startDate: '',
        endDate: ''
      },
      associatedRelease: '',
      selectedStories: {},
      selectedTasks: {},
      numSelectedStories: 0,
      numSelectedTasks: 0,
      $form: null
    }
  },
  computed: {
    defaultStartDate () {
      const date = new Date()
      return this.getFormattedDate(date)
    },
    defaultEndDate () {
      const oneDay = 24 * 60 * 60 * 1000
      const oneWeek = 7 * oneDay
      // TODO: change to use project's default sprint length value
      const date = new Date(new Date().valueOf() + 2 * oneWeek)
      return this.getFormattedDate(date)
    },
    ...mapGetters(['isDevelopmentMode', 'currentUser'])
  },
  watch: {
    initialRelease () {
      $(this.$el).find('.ui.dropdown').dropdown('set exactly', this.initialRelease)
    }
  },
  mounted () {
    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.registerClickHandler()
    })

    // add support for submitting by pressing enter
    this.$form.on('keypress', e => {
      if (e.key === 'Enter') {
        this.registerClickHandler()
      }
    })

    $(this.$el).find('.ui.dropdown').dropdown()

    this.initCheckboxes()
    this.updateButtons()
    this.resetSprintData()
  },
  methods: {
    initCheckboxes () {
      $(this.$el).find('.ui.checkbox').checkbox()
    },
    updateButtons () {
      $(this.$el).find('#selection-section #toggle-btn')
        .each(function () {
          const button = $(this)
          const label = button.find('label')

          if (button.hasClass('checked')) {
            button.addClass('red inverted')
            label.text('Remove from sprint')
          } else {
            button.removeClass('red inverted')
            label.text('Add to sprint')
          }
        })
    },
    toggleStory (id, value, updateButtons = true) {
      if (value !== undefined) {
        this.selectedStories[id] = !!value
      } else {
        this.selectedStories[id] = !this.selectedStories[id]
      }
      this.numSelectedStories = Object.keys(this.selectedStories)
        .filter(s => this.selectedStories[s])
        .length

      if (updateButtons) {
        setTimeout(() => {
          this.updateButtons()
        }, 50)
      }
    },
    toggleTask (id, value, updateButtons = true) {
      if (value !== undefined) {
        this.selectedTasks[id] = !!value
      } else {
        this.selectedTasks[id] = !this.selectedTasks[id]
      }
      this.numSelectedTasks = Object.keys(this.selectedTasks)
        .filter(t => this.selectedTasks[t])
        .length

      if (updateButtons) {
        setTimeout(() => {
          this.updateButtons()
        }, 50)
      }
    },
    getFormattedDate (date) {
      let [year, month, day] = [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        (date.getDate()).toString().padStart(2, '0')
      ]

      return `${year}-${month}-${day}`
    },
    getDateRange (release) {
      const startDate = new Date(release.startDate)
      const endDate = new Date(release.endDate)
      return `${startDate.toDateString()} to ${endDate.toDateString()}`
    },
    getDateDifference (older, newer) {
      const difference = new Date(Math.abs(newer - older))
      const attributes = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }

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

      return Object.keys(attributes)
        .filter(attr => attributes[attr] > 0)
        .map(attr => {
          const value = attributes[attr]
          return `${value} ${value === 1 ? attr : `${attr}s`}`
        }).join(', ')
    },
    async registerClickHandler () {
      const sprintData = {
        id: this.generateUniqueId()(this.sprints, 'sprint-', 4),
        name: this.sprint.name.trim(),
        stories: Object.keys(this.selectedStories).filter(id => this.selectedStories[id]),
        tasks: Object.keys(this.selectedTasks).filter(id => this.selectedTasks[id]),
        startDate: this.sprint.startDate,
        endDate: this.sprint.endDate
      }

      sprintData.name = sprintData.name || sprintData.id

      try {
        const result = await this.register(sprintData, this.associatedRelease)
        console.debug(result)
        if (result === 'OK') {
          this.$form.modal('hide')
          this.$emit('update', { sprint: sprintData.id, release: this.associatedRelease })
          this.resetSprintData()
        } else {
          console.debug('Register failed!')
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        }
      } catch (err) {
        console.debug('Register failed', err)
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }
      this.$form.removeClass('loading')
    },
    async register (data = {}, associatedRelease) {
      this.$form.addClass('loading')
      const response = await this.sendRegisterData(data, associatedRelease)
      // eslint-disable-next-line
      console.debug('register', { response })
      return response
    },
    sendRegisterData (sprintData, associatedRelease) {
      const apiUrl = `api/projects/${this.projectId}/sprints`
      const payload = {
        sprintData,
        associatedRelease,
        memberID: this.currentUser.id,
        projectID: this.projectId
      }
      console.debug('sending register data', { payload, apiUrl })
      return new Promise((resolve, reject) => {
        const url = this.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/${apiUrl}`, payload)
          .done(resolve).fail(reject)
      })
    },
    notifyError (message = 'An error occurred while trying to register') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    resetSprintData () {
      const defaults = {
        name: '',
        associatedRelease: this.initialRelease,
        startDate: this.defaultStartDate,
        endDate: this.defaultEndDate
      }
      Object.keys(defaults)
        .forEach(field => {
          this.sprint[field] = defaults[field]
        })

      // reset checkboxes
      this.selectedStories = {}
      this.selectedTasks = {}
      $(this.$el).find('#selection-section #toggle-btn').removeClass('checked')
      setTimeout(() => {
        this.updateButtons()
      }, 100)
    },
    ...mapMutations(['addProject']),
    ...mapGetters(['generateUniqueId'])
  }
}
</script>

<style>
#sprint-modal-content #selection-section .grid {
  max-height: 20rem;
  overflow-y: auto;
  border-top: 1px solid gray;
}
</style>
