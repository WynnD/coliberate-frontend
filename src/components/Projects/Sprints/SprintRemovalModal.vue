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
    numUnfinishedTasks () {
      return this.sprintTasks.filter(task => task.status !== 'done').length
    },
    dateRange () {
      if (this.targetSprint) {
        return this.dateFunctions().getDateRange(this.targetSprint.startDate, this.targetSprint.endDate)
      }
      return this.dateFunctions().getDateRange()
    },
    dateDifference () {
      if (this.targetSprint) {
        return this.dateFunctions().getDateDifferenceMessage(this.targetSprint.startDate, this.targetSprint.endDate)
      }
      return this.dateFunctions().getDateDifferenceMessage(new Date(), new Date())
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
    }
  }
}
</script>
