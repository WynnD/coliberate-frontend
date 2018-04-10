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

          </div>
        </div>

        <div
          id="selection-section"
          class="ui segment">
          <div class="ui header">Member Selector</div>
          Work in Progress...
          {{ selectedMembers }}
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
      selectedMembers: [],
      $form: null,
      dropdowns: {
        features: null,
        sprints: null,
        stories: null,
        members: null
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {
    initialFeature (newValue) {
      if (this.dropdowns.features) {
        this.dropdowns.features.dropdown('set exactly', [newValue])
        this.setDropdownValues(this.dropdowns.features, [newValue])
      }
    },
    initialSprint (newValue) {
      if (this.dropdowns.sprints) {
        this.dropdowns.sprints.dropdown('set exactly', [newValue])
        this.setDropdownValues(this.dropdowns.sprints, [newValue])
      }
    },
    initialStory (newValue) {
      if (this.dropdowns.stories) {
        this.dropdowns.stories.dropdown('set exactly', [newValue])
        this.setDropdownValues(this.dropdowns.stories, [newValue])
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
    // this.dropdowns.members = $(this.$el).find('.ui.dropdown[name="members"]').dropdown()

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
        takenBy: this.selectedMembers
      }
      taskData.name = taskData.name || taskData.id
      console.debug(taskData, {
        features: this.associatedFeatures,
        sprints: this.associatedSprints,
        stories: this.associatedStories
      })
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
      this.associatedFeatures = [this.initialFeature]
      this.associatedSprints = [this.initialSprint]
      this.associatedStories = [this.initialStory]
      this.selectedMembers = [this.currentUser.id]
    },
    ...mapGetters(['memberById', 'generateUniqueId'])
  }
}
</script>
