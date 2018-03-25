<template>
  <div class="ui modal form">
    <div class="header">Add a Feature</div>
    <div
      id="feature-modal-content"
      class="scrolling content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="ui header">General Info</div>
          <div class="ui stackable grid">
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Name</div>
                <input
                  v-model="feature.name"
                  type="text"
                  placeholder="Feature Name">
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">ID</div>
                <div class="ui basic button disabled">
                  {{ feature.id }}
                </div>
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Description</div>
                <input
                  v-model="feature.description"
                  type="text"
                  placeholder="Feature Description">
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui fluid labeled input">
                <div class="ui label">Associated Releases</div>
                <select
                  name="releases"
                  multiple=""
                  v-model="feature.associatedReleases"
                  class="ui fluid dropdown">
                  <option value="">Releases</option>
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
          </div>
        </div>

        <div
          id="selection-section"
          class="ui segment">
          <div class="ui header">Story/Task Selection</div>
          <div class="meta">
            <h4 class="header">
              Stories ({{ numSelectedStories }}/{{ numStories }} added)
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
                    <label>Add to feature</label>
                  </div>
                </story-card>
              </div>
            </div>
          </div>
          <h4 class="header">
            Tasks ({{ numSelectedTasks }}/{{ numTasks }} added)
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
                  <label>Add to feature</label>
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
import SingleStoryCard from '@/components/Projects/Cards/SingleStoryCard'
import SingleTaskCard from '@/components/Projects/Cards/SingleTaskCard'
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
    features: {
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
    }
  },
  data () {
    return {
      feature: {
        id: 0,
        name: '',
        description: '',
        stories: [],
        tasks: [],
        associatedReleases: []
      },
      selectedStories: {},
      selectedTasks: {},
      numSelectedStories: 0,
      numSelectedTasks: 0,
      $form: null
    }
  },
  computed: {
    numStories () {
      return Object.keys(this.stories).length
    },
    numTasks () {
      return Object.keys(this.tasks).length
    },
    ...mapGetters(['newProjectId', 'currentUser'])
  },
  watch: {
    initialRelease () {
      $(this.$el).find('.ui.dropdown').dropdown('set exactly', [this.initialRelease])
    }
  },
  mounted () {
    // TODO: better way to generate id
    this.feature.id = this.generateRandomId()

    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.registerHandler()
    })

    // add support for submitting by pressing enter
    this.$form.on('keypress', e => {
      if (e.key === 'Enter') {
        this.registerHandler()
      }
    })

    $(this.$el).find('.ui.dropdown').dropdown()
    this.initCheckboxes()
    this.updateButtons()
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
            label.text('Remove from feature')
          } else {
            button.removeClass('red inverted')
            label.text('Add to feature')
          }
        })
    },
    toggleStory (id) {
      this.selectedStories[id] = !this.selectedStories[id]
      this.numSelectedStories = Object.keys(this.selectedStories)
        .filter(s => this.selectedStories[s])
        .length
      setTimeout(() => {
        this.updateButtons()
      }, 50)
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
    generateRandomId () {
      const createID = (prefix, number) => `${prefix}${number.toString().padStart(4, '0')}`
      const prefix = 'feature-'
      let numberId = Math.floor(Math.random() * 1000)
      let numIterations = 0
      while (this.features[createID(prefix, numberId)] && numIterations < 1000) {
        numberId = Math.floor(Math.random() * 1000)
        numIterations++
      }

      return createID(prefix, numberId)
    },
    getDateRange (release) {
      const startDate = new Date(release.startDate)
      const endDate = new Date(release.endDate)
      return `${startDate.toDateString()} to ${endDate.toDateString()}`
    },
    async registerHandler () {
      console.debug(this.feature)
      // const projectData = {
      //   name: this.project.name.trim(),
      //   id: this.project.id,
      //   description: this.project.description.trim(),
      //   members: this.project.members,
      //   startdate: this.project.startdate,
      //   sprintLength: this.project.sprintLength
      // }
      // // eslint-disable-next-line
      // console.debug("Sending register info:", projectData)

      // try {
      //   const result = await this.register(projectData)

      //   if (result.status !== 200) {
      //     // eslint-disable-next-line
      //     console.debug("Register failed!", result);
      //     this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
      //   } else {
      //     this.$form.modal('hide')
      //     this.$router.push({ path: `/projects/${projectData.id}` })
      //   }
      // } catch (err) {
      //   // eslint-disable-next-line
      //   console.debug("Register failed!", err);
      //   const message = `${err.status}: ${err.statusText}`
      //   this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      // }
      // this.$form.removeClass('loading')
    },
    sendRegisterData (projectData) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/api/projects`, { projectData })
          .done(resolve).fail(reject)
      })
    },
    async register (projectData = {}) {
      const textFields = ['name', 'id', 'description', 'startdate']
      let errorMessage
      console.debug('checking project data', { projectData })
      textFields.forEach(f => {
        if (!errorMessage && (!projectData[f] || projectData[f].toString().trim().length === 0)) {
          errorMessage = { responseJSON: { error: `${f} field is empty` } }
        }
      })

      if (errorMessage) {
        return errorMessage
      }

      this.$form.addClass('loading')
      const data = await this.sendRegisterData(projectData)
      // eslint-disable-next-line
      console.debug('register', { data })
      return data
    },

    notifyError (message = 'An error occurred while trying to register') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    ...mapMutations(['addProject']),
    ...mapGetters(['memberById'])
  }
}
</script>

<style>
#feature-modal-content #selection-section .grid {
  max-height: 20rem;
  overflow-y: auto;
  border-top: 1px solid gray;
}
</style>
