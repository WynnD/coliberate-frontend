<template>
  <div
    id="sprint-viewer"
    class="ui segments">
    <div class="ui segment inverted grey">
      <select
        v-model="currentSprintId"
        class="ui dropdown">
        <option value="">Select a Sprint</option>
        <option
          v-for="sprint in sortedSprints"
          :key="sprint.id"
          :value="sprint.id">
          {{ getSprintLabel(sprint) }}
        </option>
      </select>
      <span
        :class="{
          'ui left pointing label': true,
          blue: isCurrentSprintActive
        }"
      >
        <b v-if="currentSprint">
          {{ isCurrentSprintActive ? 'ACTIVE' : 'INACTIVE' }}
        </b>
        <b v-else>
          {{ numSprints }} {{ numSprints === 1 ? 'Sprint' : 'Sprints' }} found
        </b>
      </span>
      <a
        @click="$emit('showmodal', 'sprint-create')"
        class="ui right floated compact white inverted icon button">
        <i class="plus icon"/>
        Add Sprint
      </a>
    </div>
    <div
      v-if="currentSprint"
      id="overview"
      class="ui segment">
      <div class="ui header medium">
        <span>Overview</span>
        <div class="ui buttons right floated compact">
          <button
            @click.stop="sprintEditHandler(currentSprint.id)"
            class="ui inverted violet icon button">
            <i class="icon edit"/>
          </button>
          <button
            @click.stop="sprintRemoveHandler(currentSprint.id)"
            class="ui inverted red icon button">
            <i class="icon trash"/>
          </button>
        </div>
      </div>
      <div class="ui center aligned grid">
        <div class="eight wide column">
          <p v-html="dateRangeMessage"/>
        </div>
        <div class="eight wide column">
          <div class="ui tiny horizontal statistic">
            <div class="value">{{ finishedTasks }} / {{ totalTasks }}</div>
            <div class="label">Extra Tasks Completed</div>
          </div>
          <br>
          <div class="ui tiny horizontal statistic">
            <div class="value">{{ finishedStories.length }} / {{ sprintStories.length }}</div>
            <div class="label">Stories Completed</div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="currentSprint"
      id="task-story-listing"
      class="ui segment">
      <div class="header">
        <span class="ui header medium">Tasks and Stories</span>
        <a
          @click="$emit('showmodal', 'story-create')"
          class="ui right floated compact icon button">
          <i class="plus icon"/>
          Add Story
        </a>
      </div>
      <div>
        <extra-tasks-accordion-item
          id="sprint-extra-tasks"
          @toggle-accordion-state="toggleAccordionState"
          name="sprint-extra-tasks"
          :showing-boolean="activeAccordion === 'sprint-extra-tasks'"
          :assigned-task-list="currentSprint.tasks"
          :all-tasks="tasks"
          :project-id="projectId"
          @update="$emit('update')"
          @showmodal="showModal"
        />
        <story-accordion-item
          v-for="story in sprintStories"
          :key="story.id"
          @toggle-accordion-state="toggleAccordionState"
          :name="`sprint-story-${story.id}`"
          :showing-boolean="activeAccordion === `sprint-story-${story.id}`"
          :story="story"
          :tasks="tasks"
          :project-id="projectId"
          @update="$emit('update')"
          @changestory="changeStory"
          @showmodal="showModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import StoryAccordionItem from '@/components/Projects/Stories/StoryAccordionItem'
import ExtraTasksAccordionItem from '@/components/Projects/Tasks/ExtraTasksAccordionItem'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

/* global $ */
export default {
  components: {
    'task-card': SingleTaskCard,
    'story-accordion-item': StoryAccordionItem,
    'extra-tasks-accordion-item': ExtraTasksAccordionItem,
    'accordion-item': SegmentAccordionItem
  },
  props: {
    release: {
      required: true,
      type: Object
    },
    sprints: {
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
    },
    initialSprint: {
      required: false,
      type: String,
      default: ''
    },
    projectId: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentSprintId: '',
      activeAccordion: ''
    }
  },
  computed: {
    ...mapGetters(['dateFunctions']),
    currentSprint () {
      return this.sprints[this.currentSprintId]
    },
    currentDate () {
      return new Date()
    },
    startDate () {
      if (this.currentSprint) {
        return new Date(this.currentSprint.startDate)
      }
      return this.currentDate
    },
    endDate () {
      if (this.currentSprint) {
        return new Date(this.currentSprint.endDate)
      }
      return this.currentDate
    },
    isCurrentSprintActive () {
      return this.currentDate.valueOf() > this.startDate.valueOf() &&
        this.currentDate.valueOf() < this.endDate.valueOf()
    },
    sprintTasks () {
      if (!this.currentSprint) {
        return []
      }
      return this.currentSprint.tasks
        .map(id => this.tasks[id])
    },
    finishedTasks () {
      return this.sprintTasks.filter(task => task.status === 'done').length
    },
    totalTasks () {
      return this.sprintTasks.length
    },
    sprintStories () {
      if (!this.currentSprint) {
        return []
      }
      return this.currentSprint.stories
        .map(id => this.stories[id])
    },
    finishedStories () {
      return this.sprintStories.filter(s => s.status === 'done')
    },
    numSprints () {
      return this.release.sprints.length
    },
    dateRangeMessage () {
      if (!this.currentSprint) {
        return ''
      }
      const dateRange = this.dateFunctions.getDateRange(this.startDate, this.endDate)
        // bold the dates
        .split(' to ').map(d => `<b>${d}</b>`).join(' to ')
      const dateDifference = this.dateFunctions.getDateDifferenceMessage(this.startDate, this.endDate)
      let relativeDifferenceMessage
      if (this.currentDate < this.startDate) {
        const relativeDifference = this.dateFunctions.getRelativeDateDifferenceMessage(this.startDate, ['millisecond', 'second'])
        relativeDifferenceMessage = `starts ${relativeDifference}`
      } else {
        const relativeDifference = this.dateFunctions.getRelativeDateDifferenceMessage(this.endDate, ['millisecond', 'second'])
        if (this.currentDate < this.endDate) {
          relativeDifferenceMessage = `ends ${relativeDifference}`
        } else {
          relativeDifferenceMessage = `ended ${relativeDifference}`
        }
      }
      return `${dateRange}<br>(${dateDifference} long, ${relativeDifferenceMessage})`
    },
    sortedSprints () {
      return this.release.sprints.map(id => this.sprints[id])
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    }
  },
  watch: {
    currentSprintId (newValue) {
      console.debug('currentSprintId', newValue)
      this.$emit('changesprint', newValue)
    },
    initialSprint (newValue) {
      console.debug('initial sprint', newValue)
      this.currentSprintId = newValue
      $(this.$el).find('.ui.dropdown')
        .dropdown('set exactly', newValue)
    },
    sprints () {
      const currentSprintId = this.currentSprintId
      console.debug('sprints updated', currentSprintId)
      $(this.$el).find('.ui.dropdown')
        .dropdown('set exactly', this.currentSprintId)
      setTimeout(() => {
        this.currentSprintId = currentSprintId
      }, 50)
    },
    release () {
      this.currentSprintId = ''
      $(this.$el).find('.ui.dropdown').dropdown('restore defaults')
    },
    projectId () {
      this.checkProjectId()
    }
  },
  mounted () {
    $(this.$el).find('.ui.dropdown').dropdown()
    this.checkProjectId()
  },
  methods: {
    checkProjectId () {
      if (!this.projectId) {
        console.warn('no project id specified')
      }
    },
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
    },
    storyEditHandler (storyId) {
      console.debug('Clicked edit for', storyId)
    },
    storyRemoveHandler (storyId) {
      console.debug('Clicked remove for', storyId)
    },
    sprintEditHandler (sprintId) {
      console.debug('Clicked edit for', sprintId)
    },
    sprintRemoveHandler (sprintId) {
      console.debug('Clicked remove for', sprintId)
      this.$emit('showmodal', `sprint-remove|${sprintId}`)
    },
    showModal (data) {
      this.$emit('showmodal', data)
    },
    changeStory (data) {
      this.$emit('changestory', data)
    },
    isSprintActive (sprint) {
      const startDate = new Date(sprint.startDate)
      const endDate = new Date(sprint.endDate)
      return this.currentDate.valueOf() > startDate.valueOf() &&
        this.currentDate.valueOf() < endDate.valueOf()
    },
    getSprintLabel (sprint) {
      return `${sprint.name || sprint.id}${this.isSprintActive(sprint) ? ' (Active)' : ''}`
    }
  }
}
</script>
