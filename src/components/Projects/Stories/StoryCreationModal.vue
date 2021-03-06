<template>
  <div class="ui modal form">
    <div class="header">Add a Story</div>
    <div
      id="story-modal-content"
      class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name</div>
                <input
                  v-model="story.name"
                  type="text"
                  placeholder="Story Name">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Business Value</div>
                <input
                  v-model="story.businessValue"
                  type="number"
                  placeholder="Story Business Value">
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui label">Description</div>
              <div class="ui fluid input">
                <textarea
                  v-model="story.description"
                  placeholder="Story Description"/>
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Associated Features</div>
                <select
                  name="features"
                  multiple=""
                  v-model="associatedFeatures"
                  class="ui fluid dropdown">
                  <option value="">Features</option>
                  <option
                    v-for="feature in features"
                    :key="feature.id"
                    :value="feature.id"
                  >
                    {{ feature.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Associated Sprints</div>
                <select
                  name="sprints"
                  multiple=""
                  v-model="associatedSprints"
                  class="ui fluid dropdown">
                  <option value="">Sprints</option>
                  <option
                    v-for="sprint in sprints"
                    :key="sprint.id"
                    :value="sprint.id"
                  >
                    {{ sprint.name }} ({{ getDateRange(sprint) }})
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div
          id="selection-section"
          class="ui segment">
          <div class="ui header">
            <span>Task Selection</span>
            <span>({{ numSelectedTasks }}/{{ numTasks }} added)</span>
          </div>
          <div class="ui three column stackable grid">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="column">
              <task-card :task="task">
                <div
                  id="toggle-btn"
                  @click="toggleTask(task.id)"
                  class="ui fluid button task-toggle-btn checkbox">
                  <input
                    type="checkbox"
                    :value="task.id"
                    v-model="selectedTasks[task.id]">
                  <label>Add to story</label>
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
        @click="registerHandler">
        Add
      </button>
      <div class="ui cancel red button">Cancel</div>
    </div>
  </div>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import { mapGetters } from 'vuex'

/* global $ */
export default {
  components: {
    'task-card': SingleTaskCard
  },
  props: {
    stories: {
      required: true,
      type: Object
    },
    tasks: {
      required: true,
      type: Object
    },
    features: {
      required: true,
      type: Object
    },
    sprints: {
      required: true,
      type: Object
    },
    initialFeature: {
      required: false,
      type: String,
      default: ''
    },
    initialSprint: {
      required: false,
      type: String,
      default: ''
    },
    projectId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      story: {
        name: '',
        description: '',
        businessValue: 5
      },
      associatedFeatures: [],
      associatedSprints: [],
      selectedTasks: {},
      numSelectedTasks: 0,
      $form: null,
      featureDropdown: null,
      sprintDropdown: null
    }
  },
  computed: {
    numTasks () {
      return Object.keys(this.tasks).length
    },
    ...mapGetters(['currentUser', 'isDevelopmentMode'])
  },
  watch: {
    initialFeature (newValue) {
      if (this.featureDropdown) {
        this.featureDropdown.dropdown('set exactly', [newValue])
      }
    },
    initialSprint (newValue) {
      if (this.sprintDropdown) {
        this.sprintDropdown.dropdown('set exactly', [newValue])
      }
    }
  },
  mounted () {
    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.registerHandler()
    })

    // // add support for submitting by pressing enter
    // this.$form.on('keypress', e => {
    //   if (e.key === 'Enter') {
    //     this.registerHandler()
    //   }
    // })

    this.featureDropdown = $(this.$el).find('.ui.dropdown[name="features"]').dropdown()
    this.sprintDropdown = $(this.$el).find('.ui.dropdown[name="sprints"]').dropdown()

    this.initCheckboxes()
    this.updateButtons()
    this.resetStoryData()
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
          const isTaskButton = button.hasClass('task-toggle-btn')

          if (button.hasClass('checked')) {
            button.addClass('red inverted')
            label.text(`Remove from ${isTaskButton ? 'story' : 'feature'}`)
          } else {
            button.removeClass('red inverted')
            label.text(`Add to ${isTaskButton ? 'story' : 'feature'}`)
          }
        })
    },
    toggleTask (id) {
      this.selectedTasks[id] = !this.selectedTasks[id]
      this.numSelectedTasks = Object.keys(this.selectedTasks)
        .filter(t => this.selectedTasks[t])
        .length

      setTimeout(() => {
        this.updateButtons()
      }, 50)
    },
    getDateRange (sprint) {
      const startDate = new Date(sprint.startDate)
      const endDate = new Date(sprint.endDate)
      return `${startDate.toDateString()} to ${endDate.toDateString()}`
    },
    async registerHandler () {
      const storyData = {
        id: this.generateUniqueId()(this.stories, 'story-', 4),
        name: this.story.name.trim(),
        description: this.story.description,
        businessValue: this.story.businessValue,
        tasks: Object.keys(this.selectedTasks).filter(id => this.selectedTasks[id])
      }
      storyData.name = storyData.name || storyData.id
      const associatedData = {
        features: this.associatedFeatures.filter(id => !!id),
        sprints: this.associatedSprints.filter(id => !!id)
      }
      console.debug(storyData, associatedData)

      try {
        const result = await this.register(storyData, associatedData)
        console.debug(result)
        if (result === 'OK') {
          this.$form.modal('hide')
          this.$emit('update')
          this.resetStoryData()
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
    async register (data = {}, associatedData) {
      this.$form.addClass('loading')
      const response = await this.sendRegisterData(data, associatedData)
      // eslint-disable-next-line
      console.debug('register', { response })
      return response
    },
    sendRegisterData (storyData, associatedData) {
      const apiUrl = `api/projects/${this.projectId}/stories`
      const payload = {
        storyData,
        associatedFeatures: associatedData.features,
        associatedSprints: associatedData.sprints,
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
    resetStoryData () {
      const defaults = {
        name: '',
        description: '',
        businessValue: 5
      }
      Object.keys(defaults)
        .forEach(field => {
          this.story[field] = defaults[field]
        })
      this.associatedFeatures = [this.initialFeature]
      this.associatedSprints = [this.initialSprint]
      this.numSelectedTasks = 0
      this.selectedTasks = {}
      $(this.$el).find('#selection-section #toggle-btn').removeClass('checked')
      setTimeout(() => {
        this.updateButtons()
      }, 100)
      if (this.$form) {
        this.$form.removeClass('error')
      }
    },
    ...mapGetters(['generateUniqueId'])
  }
}
</script>

<style>
#story-modal-content #selection-section .grid {
  max-height: 20rem;
  overflow-y: auto;
  border-top: 1px solid gray;
}
</style>
