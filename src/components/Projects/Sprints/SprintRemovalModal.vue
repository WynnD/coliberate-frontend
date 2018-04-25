<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">
    <section slot="header">Remove Sprint Confirmation</section>
    <section slot="content">
      <div v-if="targetSprint">
        <h3>Are you sure you want to remove "{{ targetSprint.name }}"?</h3>
        <p>
          <b>Date Range: </b>
          <span>{{ dateRange }}</span>
          <span v-if="dateDifference">
            ({{ dateDifference }})
          </span>
        </p>

        <div v-if="sprintStories.length > 0 || sprintTasks.length > 0">
          <p>The following will be put into the backlog if they aren't associated with anything else.</p>
          <div v-if="sprintTasks.length > 0">
            <h4>Tasks</h4>
            <div class="ui three stackable cards">
              <task-card
                v-for="task in sprintTasks"
                :key="task.id"
                :show-buttons="false"
                :task="task"/>
            </div>
          </div>
          <div v-if="sprintStories.length > 0">
            <h4>Stories</h4>
            <story-accordion-item
              v-for="story in sprintStories"
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
        <div v-else>No associated stories or tasks found with this sprint</div>
        <hr>
        <div v-if="associatedReleases.length">
          <p>The following release will have the sprint removed from its respective sprint list.</p>
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
    targetSprintId: {
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
      activeAccordion: ''
    }
  },
  computed: {
    targetSprint () {
      return this.project.sprints[this.targetSprintId]
    },
    sprintStories () {
      return this.targetSprint.stories
        .map(id => this.project.stories[id])
    },
    sprintTasks () {
      return this.targetSprint.tasks
        .map(id => this.project.tasks[id])
    },
    associatedReleases () {
      return Object.values(this.project.releases)
        .filter(r => r.sprints.includes(this.targetSprintId))
    },
    dateRange () {
      if (this.targetSprint) {
        return this.dateFunctions().getDateRange(this.targetSprint.startDate, this.targetSprint.endDate)
      }
      return this.dateFunctions().getDateRange()
    },
    dateDifference () {
      if (!this.targetSprint) {
        return this.dateFunctions().getDateDifferenceMessage(new Date(), new Date())
      }
      const startDate = new Date(this.targetSprint.startDate)
      const endDate = new Date(this.targetSprint.endDate)
      const currentDate = new Date()
      const difference = this.dateFunctions().getDateDifferenceMessage(startDate, endDate)
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
      return `${difference} long, ${relativeDifferenceMessage}`
    },
    apiUrl () {
      return `api/projects/${this.project.id}/sprints/${this.targetSprintId}?member_id=${this.currentUser.id}`
    },
    ...mapGetters(['currentUser'])
  },
  methods: {
    ...mapGetters(['server', 'dateFunctions']),
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
