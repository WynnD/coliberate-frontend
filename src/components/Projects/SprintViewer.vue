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
          {{ sprintId }}
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
      </a>
    </div>
    <div
      v-if="currentSprint"
      id="overview"
      class="ui segment">
      <div class="ui header medium">Overview</div>
      <span>Sprint-level statistics go here (story completion, task completion, visual for days remaining, burndown/up chart, etc.)</span>
    </div>
    <div
      v-if="currentSprint"
      id="task-story-listing"
      class="ui segment">
      <div class="header">
        <span class="ui header medium">Tasks and Stories</span>
        <a class="ui right floated compact icon button">
          <i class="plus icon"/>
        </a>
      </div>
      <div>
        <div
          id="extra-tasks"
          class="ui segments">
          <div
            @click="toggleAccordionState('sprint-extra-tasks')"
            :class="{
              'ui segment accord-title': true,
              'accord-active': activeAccordion === `sprint-extra-tasks`
            }"
          >
            <i class="dropdown icon"/>
            <span>Extra Tasks</span>
            <div
              :class="{
                'ui left pointing label': true,
                yellow: tasksRemaining > 0
              }"
            >
              {{ tasksRemaining }} REMAINING
            </div>
          </div>
          <div
            v-show="activeAccordion === 'sprint-extra-tasks'"
            class="ui segment accord-content">
            <div class="ui fluid container grid">
              <div class="row">
                <div class="sixteen wide column">
                  <span class="ui small header">
                    Tasks ({{ tasksRemaining }}/{{ totalTasks }} Remaining)
                  </span>
                  <a class="ui right floated compact icon button">
                    <i class="plus icon"/>
                  </a>
                </div>
              </div>
              <div class="row">
                <div class="sixteen wide column">
                  <div class="ui three stackable cards">
                    <task-card
                      v-for="task in sprintTasks"
                      :key="task.id"
                      :task="task"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="story in sprintStories"
          :key="story.id"
          class="ui segments">
          <div
            @click="toggleAccordionState(`sprint-${story.id}`)"
            :class="{
              'ui segment accord-title': true,
              'accord-active': activeAccordion === `sprint-${story.id}`
            }"
          >
            <i class="dropdown icon"/>
            <span>{{ story.name }}</span>
            <div
              :class="{
                'ui left pointing label story-status': true,
                yellow: story.status === 'in-progress',
                green: story.status === 'done',
                red: story.status === 'todo'
              }"
            >
              {{ story.status.toUpperCase() }}
            </div>
            <div class="ui buttons right floated compact">
              <button class="ui icon button"><i class="icon edit"/></button>
              <button class="ui icon button"><i class="icon trash"/></button>
            </div>
          </div>

          <div
            v-show="activeAccordion === `sprint-${story.id}`"
            class="ui segment accord-content">
            <div class="ui fluid container grid">
              <div class="row">
                <div class="eight wide column">
                  {{ story.description }}
                </div>
                <div class="eight wide column">
                  Story 1 stats here
                </div>
              </div>
              <div class="row">
                <div class="sixteen wide column">
                  <hr>
                  <span class="ui small header">Tasks ({{ story.tasks.length }})</span>
                  <a class="ui right floated compact icon button">
                    <i class="plus icon"/>
                  </a>
                </div>
              </div>
              <div class="row">
                <div class="sixteen wide column">
                  <span v-if="story.tasks.length === 0">No tasks found</span>
                  <div
                    v-else
                    class="ui three stackable cards">
                    <task-card
                      v-for="taskId in story.tasks"
                      :key="taskId"
                      :task="tasks[taskId]"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Cards/SingleTaskCard'

/* global $ */
export default {
  components: {
    'task-card': SingleTaskCard
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
    currentSprint (newValue) {
      // reset accordion states on new sprint selection
      this.accordionStates = newValue ? {} : this.accordionStates
    }
  },
  mounted () {
    $(this.$el).find('.ui.dropdown').dropdown()
  },
  methods: {
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

<style>
#sprint-viewer #task-story-listing>.header {
  margin-bottom: 1rem;
}

#sprint-viewer .accord-title:hover {
  cursor: pointer;
  background-color: gainsboro;
}

#sprint-viewer .accord-title .icon.dropdown {
  transform: rotate(-90deg);
}

#sprint-viewer .accord-title.accord-active {
  background-color: lightgray;
}

#sprint-viewer .accord-title.accord-active .icon.dropdown {
  transform: rotate(0deg);
}
</style>
