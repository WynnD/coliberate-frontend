<template>
  <div class="ui modal form">
    <div class="header">Remove Task Confirmation</div>
    <div
      v-if="targetTask"
      class="scrolling content">
      <h3>Are you sure you want to remove "{{ targetTask.name }}"?</h3>
      <div v-if="hasAssociations">
        <p>The following items will have the task removed from their respective task list.</p>
        <div v-if="associatedFeatures.length > 0">
          <h4>Features</h4>
          <feature-accordion-item
            v-for="feature in associatedFeatures"
            :key="`feature-${feature.id}`"
            :id="`feature-${feature.id}`"
            :feature="feature"
            :active-accordion="activeAccordion"
            @toggle-accordion-state="toggleAccordionState"
            :name="`feature-${feature.id}`"
            :stories="project.stories"
            :tasks="project.tasks"
            @click.native="refreshModal"
            :show-buttons="false"
          />
        </div>
        <div v-if="associatedSprints.length > 0">
          <h4>Sprints</h4>
          <sprint-accordion-item
            v-for="sprint in associatedSprints"
            :key="`sprint-${sprint.id}`"
            :id="`sprint-${sprint.id}`"
            :sprint="sprint"
            :active-accordion="activeAccordion"
            @toggle-accordion-state="toggleAccordionState"
            :name="`sprint-${sprint.id}`"
            :stories="project.stories"
            :tasks="project.tasks"
            @click.native="refreshModal"
            :show-buttons="false"
          />
        </div>
        <div>
          <h4>Stories</h4>
          {{ associatedStories }}
        </div>
      </div>
      <div v-else>This task is not associated with any feature, sprint, or story.</div>
      <div class="ui error message">
        <div class="header">Error</div>
        <p>An error has occurred</p>
      </div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui red button">
        Remove Task
      </button>
      <div class="ui grey cancel button">Cancel</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StoryAccordionItem from '@/components/Projects/Stories/StoryAccordionItem'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'
import SprintAccordionItem from '@/components/Projects/Sprints/SprintAccordionItem'

/* global $ */
export default {
  components: {
    'feature-accordion-item': FeatureAccordionItem,
    'story-accordion-item': StoryAccordionItem,
    'sprint-accordion-item': SprintAccordionItem
  },
  props: {
    targetTaskId: {
      required: false,
      type: String,
      default: ''
    },
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      isLoading: false,
      $form: null,
      activeAccordion: '',
      activeSubAccordion: ''
    }
  },
  computed: {
    targetTask () {
      return this.project.tasks[this.targetTaskId]
    },
    associatedFeatures () {
      return Object.values(this.project.features)
        .filter(f => f.tasks.includes(this.targetTaskId))
    },
    associatedSprints () {
      return Object.values(this.project.sprints)
        .filter(s => s.tasks.includes(this.targetTaskId))
    },
    associatedStories () {
      return Object.values(this.project.stories)
        .filter(s => s.tasks.includes(this.targetTaskId))
    },
    hasAssociations () {
      return this.associatedFeatures.length > 0 ||
        this.associatedSprints.length > 0 ||
        this.associatedStories.length > 0
    },
    ...mapGetters(['currentUser'])
  },
  watch: {
    isLoading (newValue) {
      if (newValue) {
        this.$form.addClass('loading')
      } else {
        this.$form.removeClass('loading')
      }
    },
    targetTaskId () {
      this.$form.removeClass('error')
    }
  },
  mounted () {
    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.requestHandler()
    })

    this.$form.find('.actions .ui.red.button')
      .on('click', (e) => {
        e.preventDefault()
        this.requestHandler()
      })
  },
  methods: {
    ...mapGetters(['server']),
    async requestHandler () {
      console.debug('Sending request to delete task', this.targetTask.id)
      this.isLoading = true

      try {
        const result = await this.deleteTask(this.targetTask.id)
        console.debug('result', result)
        if (result === 'OK') {
          this.$form.modal('hide')
          this.$emit('update')
        } else {
          console.debug('Register failed!')
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        }
      } catch (err) {
        console.debug('Register failed', err)
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }

      this.isLoading = false
    },
    deleteTask (id) {
      const apiUrl = `api/projects/${this.project.id}/tasks/${id}?member_id=${this.currentUser.id}`
      return this.server().deleteFromServer(apiUrl)
    },
    notifyError (message = 'An error occurred while trying to register') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
      this.activeSubAccordion = ''
    },
    toggleAccordionSubState (field) {
      if (this.activeSubAccordion === field) {
        this.activeSubAccordion = ''
      } else {
        this.activeSubAccordion = field
      }
    },
    refreshModal () {
      setTimeout(() => {
        this.$form.modal('refresh')
      }, 50)
    }
  }
}
</script>
