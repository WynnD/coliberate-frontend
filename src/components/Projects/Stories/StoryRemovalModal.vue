<template>
  <div class="ui modal form">
    <div class="header">Remove Story Confirmation</div>
    <div
      v-if="targetStory"
      class="scrolling content">
      <h3>Are you sure you want to remove "{{ targetStory.name }}"?</h3>
      <div v-if="storyTasks.length > 0">
        <p>The following tasks will be put into the backlog if they aren't associated with anything else</p>
        <div class="ui three stackable cards">
          <task-card
            v-for="task in storyTasks"
            :key="task.id"
            :show-buttons="false"
            :task="task"/>
        </div>
      </div>
      <div v-else>
        <p>No associated tasks found with this story.</p>
      </div>
      <hr>
      <div v-if="hasAssociations">
        {{ associatedFeatures }}
        {{ associatedSprints }}
      </div>
      <div v-else>
        This story is not associated with any feature or sprint.
      </div>
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
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'
import SprintAccordionItem from '@/components/Projects/Sprints/SprintAccordionItem'

/* global $ */
export default {
  components: {
    'task-card': SingleTaskCard,
    'feature-accordion-item': FeatureAccordionItem,
    'sprint-accordion-item': SprintAccordionItem
  },
  props: {
    targetStoryId: {
      required: true,
      type: String
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
    targetStory () {
      return this.project.stories[this.targetStoryId]
    },
    associatedFeatures () {
      return Object.values(this.project.features)
        .filter(f => f.stories.includes(this.targetStoryId))
    },
    associatedSprints () {
      return Object.values(this.project.sprints)
        .filter(s => s.stories.includes(this.targetStoryId))
    },
    hasAssociations () {
      return this.associatedFeatures.length > 0 || this.associatedSprints.length > 0
    },
    storyTasks () {
      if (!this.targetStory) {
        return []
      }

      return this.targetStory.tasks.map(id => this.project.tasks[id])
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
    targetStoryId () {
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
  }
}
</script>
