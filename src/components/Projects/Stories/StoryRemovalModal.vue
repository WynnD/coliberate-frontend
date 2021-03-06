<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">
    <section slot="header">Remove Story Confirmation</section>
    <section slot="content">
      <div v-if="targetStory">
        <h3>Are you sure you want to remove "{{ targetStory.name }}"?</h3>
        <div v-if="storyTasks.length > 0">
          <p>The following tasks will be put into the backlog if they aren't associated with anything else.</p>
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
          <p>The following items will have the story removed from their respective story list.</p>
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
              :show-buttons="false"
            />
          </div>
        </div>
        <div v-else>
          This story is not associated with any feature or sprint.
        </div>
      </div>
    </section>
  </remove-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'
import SprintAccordionItem from '@/components/Projects/Sprints/SprintAccordionItem'
import RemoveModal from '@/components/RemoveModal'

/* global $ */
export default {
  components: {
    'task-card': SingleTaskCard,
    'feature-accordion-item': FeatureAccordionItem,
    'sprint-accordion-item': SprintAccordionItem,
    'remove-modal': RemoveModal
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
    apiUrl () {
      return `api/projects/${this.project.id}/stories/${this.targetStoryId}?member_id=${this.currentUser.id}`
    },
    ...mapGetters(['currentUser'])
  },
  watch: {
    targetStoryId () {
      this.activeAccordion = ''
      this.$form.removeClass('error')
      this.refreshModal()
    }
  },
  mounted () {
    this.$form = $(this.$el)
  },
  methods: {
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
