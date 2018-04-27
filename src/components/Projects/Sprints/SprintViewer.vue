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
          v-for="sprintId in release.sprints"
          :key="sprintId"
          :value="sprintId">
          {{ sprints[sprintId].name || sprintId }}
        </option>
      </select>
      <span
        :class="{
          'ui left pointing label': true,
          blue: isSprintActive
        }"
      >
        <b v-if="currentSprint">
          {{ isSprintActive ? 'ACTIVE' : 'INACTIVE' }}
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
      <span>Sprint-level statistics go here (story completion, task completion, visual for days remaining, burndown/up chart, etc.)</span>
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
    isSprintActive () {
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
    tasksRemaining () {
      return this.sprintTasks.filter(task => task.status !== 'done').length
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
    numSprints () {
      return this.release.sprints.length
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
    }
  }
}
</script>
