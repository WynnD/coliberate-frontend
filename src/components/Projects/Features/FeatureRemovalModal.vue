<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">
    <section slot="header">Remove Feature Confirmation</section>
    <section slot="content">
      <div v-if="targetFeature">
        <h3>Are you sure you want to remove "{{ targetFeature.name }}"?</h3>
        <p><b>Description:</b> {{ targetFeature.description }}</p>

        <div v-if="featureStories.length > 0 || featureTasks.length > 0">
          <p>The following will be put into the backlog if they aren't associated with anything else.</p>
          <div v-if="featureTasks.length > 0">
            <h4>Tasks</h4>
            <div class="ui three stackable cards">
              <task-card
                v-for="task in featureTasks"
                :key="task.id"
                :show-buttons="false"
                :task="task"/>
            </div>
          </div>
          <div v-if="featureStories.length > 0">
            <h4>Stories</h4>
            <story-accordion-item
              v-for="story in featureStories"
              :key="story.id"
              @toggle-accordion-state="toggleAccordionState"
              :name="`story-list-${story.id}`"
              :story="story"
              :tasks="project.tasks"
              :showing-boolean="activeAccordion === `story-list-${story.id}`"
              :show-buttons="false"
            />
          </div>
        </div>
        <div v-else>No associated stories or tasks found with this feature.</div>
        <hr>
        <div v-if="associatedReleases.length">
          <p>The following release will have the feature removed from its respective feature list.</p>
          <div class="ui relaxed divided list">
            <div
              v-for="release in associatedReleases"
              :key="release.id"
              class="item">
              <div class="content">
                <span class="header">{{ release.name }}</span>
                <div class="description">{{ getReleaseDateRange(release) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>No releases have this feature.</div>
      </div>
    </section>
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
  },
  methods: {
    ...mapGetters(['dateFunctions']),
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
    },
    getReleaseDateRange (release) {
      const startDate = new Date(release.startDate)
      const endDate = new Date(release.endDate)
      const currentDate = new Date()
      const dateRange = this.dateFunctions().getDateRange(startDate, endDate)
      const dateDifference = this.dateFunctions().getDateDifferenceMessage(release.startDate, release.endDate)
      let relativeDifferenceMessage
      if (currentDate < startDate) {
        const relativeDifference = this.dateFunctions().getRelativeDateDifferenceMessage(startDate, ['millisecond', 'second'])
        relativeDifferenceMessage = `starts ${relativeDifference}`
      } else {
        const relativeDifference = this.dateFunctions().getRelativeDateDifferenceMessage(endDate, ['millisecond', 'second'])
        if (currentDate < endDate) {
          relativeDifferenceMessage = `ends ${relativeDifference}`
        } else {
          relativeDifferenceMessage = `ended ${relativeDifference}`
        }
      }
      return `${dateRange} (${dateDifference} long, ${relativeDifferenceMessage})`
    }
  }
}
</script>
