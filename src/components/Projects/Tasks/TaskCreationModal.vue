<template>
  <div class="ui modal form">
    <div class="header">Add a Task</div>
    <div
      id="task-modal-content"
      class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name</div>
                <input
                  v-model="task.name"
                  type="text"
                  placeholder="Task Name">
              </div>
            </div>

            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Points</div>
                <input
                  v-model="task.points"
                  type="number"
                  placeholder="Task Points">
              </div>
            </div>

            <div class="sixteen wide column">
              <div class="ui label">Description</div>
              <div class="ui fluid input">
                <textarea
                  v-model="task.description"
                  placeholder="Task Description"/>
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

            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Associated Stories</div>
                <select
                  name="stories"
                  multiple=""
                  v-model="associatedStories"
                  class="ui fluid dropdown">
                  <option value="">Stories</option>
                  <option
                    v-for="story in stories"
                    :key="story.id"
                    :value="story.id"
                  >
                    {{ story.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="sixteen wide column">
              <div class="ui checkbox">
                <input
                  v-model="takeTask"
                  type="checkbox">
                <label>Take This Task</label>
              </div>
            </div>

            <div class="sixteen wide column">
              <div class="ui error message">
                <div class="header">Error</div>
                <p>An error has occurred</p>
              </div>
            </div>

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
import { mapGetters } from 'vuex'

/* global $ */
export default {
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
    projectMembers: {
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
    initialStory: {
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
      task: {
        name: '',
        description: '',
        points: 5
      },
      associatedFeatures: [],
      associatedSprints: [],
      associatedStories: [],
      takeTask: false,
      $form: null,
      dropdowns: {
        features: null,
        sprints: null,
        stories: null,
        members: null
      },
      lastModified: ''
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {
    initialFeature (newValue) {
      if (this.dropdowns.features) {
        this.lastModified = 'initialFeature'
        this.resetInitialAssociatedValues()
      }
    },
    initialSprint (newValue) {
      if (this.dropdowns.sprints) {
        this.lastModified = 'initialSprint'
        this.resetInitialAssociatedValues()
      }
    },
    initialStory (newValue) {
      if (this.dropdowns.stories) {
        this.lastModified = 'initialStory'
        this.resetInitialAssociatedValues()
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

    this.dropdowns.features = $(this.$el).find('.ui.dropdown[name="features"]').dropdown()
    this.dropdowns.sprints = $(this.$el).find('.ui.dropdown[name="sprints"]').dropdown()
    this.dropdowns.stories = $(this.$el).find('.ui.dropdown[name="stories"]').dropdown()

    // this.updateButtons()
    this.resetTaskData()
  },
  methods: {
    setDropdownValues (dropdown, newValue = []) {
      dropdown.dropdown('set exactly', newValue)
    },
    getDateRange (sprint) {
      const startDate = new Date(sprint.startDate)
      const endDate = new Date(sprint.endDate)
      return `${startDate.toDateString()} to ${endDate.toDateString()}`
    },
    async registerHandler () {
      const taskData = {
        id: this.generateUniqueId()(this.tasks, 'task-', 4),
        name: this.task.name.trim(),
        description: this.task.description.trim(),
        points: this.task.points,
        status: 'TODO',
        takenBy: this.takeTask ? [this.currentUser.id] : []
      }
      taskData.name = taskData.name || taskData.id
      const dataToSend = {
        taskData,
        // only filter out entries that are empty; validation is server-side
        features: this.associatedFeatures.filter(id => !!id),
        sprints: this.associatedSprints.filter(id => !!id),
        stories: this.associatedStories.filter(id => !!id)
      }
      try {
        const result = await this.register(dataToSend)
        console.debug(result)
        if (result === 'OK') {
          this.$form.modal('hide')
          this.$emit('update')
          this.resetTaskData()
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
    async register (data) {
      this.$form.addClass('loading')
      const response = await this.sendRegisterData(data)
      // eslint-disable-next-line
      console.debug('register', { response })
      return response
    },
    sendRegisterData (data) {
      const apiUrl = `api/projects/${this.projectId}/tasks`
      const payload = {
        taskData: data.taskData,
        associatedFeatures: data.features,
        associatedSprints: data.sprints,
        associatedStories: data.stories,
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
    resetTaskData () {
      const defaults = {
        name: '',
        description: '',
        points: 5
      }

      Object.keys(defaults)
        .forEach(field => {
          this.task[field] = defaults[field]
        })
      this.resetInitialAssociatedValues()
      this.takeTask = false
    },
    resetInitialAssociatedValues () {
      try {
        this.resetDropdowns()
        if (this.lastModified === 'initialFeature' && this.dropdowns.features) {
          this.setDropdownValues(this.dropdowns.features, [this.initialFeature])
        } else if (this.lastModified === 'initialSprint' && this.dropdowns.sprints) {
          this.setDropdownValues(this.dropdowns.sprints, [this.initialSprint])
        } else if (this.lastModified === 'initialStory' && this.dropdowns.stories) {
          this.setDropdownValues(this.dropdowns.stories, [this.initialStory])
        }
      } catch (err) {
        console.debug(err)
      }
    },
    resetDropdowns () {
      this.associatedFeatures = []
      this.associatedSprints = []
      this.associatedStories = []
      Object.values(this.dropdowns)
        .filter(d => !!d)
        .forEach(d => { this.setDropdownValues(d, []) })
    },
    getMemberName (id) {
      if (id === this.currentUser.id) {
        return this.currentUser.name
      }
      const member = this.memberById()(id)
      console.debug('member info', id, member)
      return member.name
    },
    ...mapGetters(['memberById', 'generateUniqueId'])
  }
}
</script>
