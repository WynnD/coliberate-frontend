<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">
    <section slot="header">Remove Task Confirmation</section>
    <section slot="content">
      <div v-if="targetTask">
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
          <div v-if="associatedStories.length > 0">
            <h4>Stories</h4>
            <story-accordion-item
              v-for="story in associatedStories"
              :key="story.id"
              @toggle-accordion-state="toggleAccordionState"
              :name="`story-list-${story.id}`"
              :story="story"
              :tasks="project.tasks"
              @click.native="refreshModal"
              :showing-boolean="activeAccordion === `story-list-${story.id}`"
              :show-buttons="false"
            />
          </div>
        </div>
        <div v-else>This task is not associated with any feature, sprint, or story.</div>
      </div>
    </section>
  </remove-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import StoryAccordionItem from '@/components/Projects/Stories/StoryAccordionItem'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'
import SprintAccordionItem from '@/components/Projects/Sprints/SprintAccordionItem'
import RemoveModal from '@/components/RemoveModal'

/* global $ */
export default {
  components: {
    'feature-accordion-item': FeatureAccordionItem,
    'story-accordion-item': StoryAccordionItem,
    'sprint-accordion-item': SprintAccordionItem,
    'remove-modal': RemoveModal
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
    apiUrl () {
      return `api/projects/${this.project.id}/tasks/${this.targetTaskId}?member_id=${this.currentUser.id}`
    },
    ...mapGetters(['currentUser'])
  },
  watch: {
    targetTaskId () {
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
