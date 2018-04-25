<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">

  </remove-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'
import StoryAccordionItem from '@/components/Projects/Stories/StoryAccordionItem'
import RemoveModal from '@/components/RemoveModal'

export default {
  components: {
    'task-card': SingleTaskCard,
    'accordion-item': SegmentAccordionItem,
    'story-accordion-item': StoryAccordionItem,
    'remove-modal': RemoveModal
  },
  props: {
    targetFeatureId: {
      required: false,
      type: String,
      default: ''
    },
    project: {
      required: true,
      type: Object
    }
  },
  date () {
    return {
      activeAccordion: ''
    }
  },
  computed: {
    targetFeature () {
      return this.project.features[this.targetFeatureId]
    },
    featureStories () {
      return this.targetFeature.stories
        .map(id => this.project.stories[id])
    },
    featureTasks () {
      return this.targetFeature.tasks
        .map(id => this.project.tasks[id])
    },
    associatedReleases () {
      return Object.values(this.project.releases)
        .filter(r => r.features.includes(this.targetFeatureId))
    },
    apiUrl () {
      return `api/projects/${this.project.id}/features/${this.targetFeatureId}?member_id=${this.currentUser.id}`
    },
    ...mapGetters(['currentUser'])
  }
}
</script>
