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
        <b>{{ isSprintActive ? 'ACTIVE' : 'INACTIVE' }}</b>
      </span>
      <a class="ui right floated compact white inverted icon button">
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
      <div class="ui styled fluid accordion">
        <!-- Extra Tasks Section -->
        <div class="active title">
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
        <div class="active content">
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
                <!-- <div class="ui three column stackable grid">
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 1 Card</div>
                        <div class="description">
                          Task 1 description here. Also buttons/links for edit/remove interactions will be here
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 2 Card</div>
                        <div class="description">
                          Task 2 description here. Will need to make sure height is consistent
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 3 Card</div>
                        <div class="description">
                          Task 3 description here
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 4 Card</div>
                        <div class="description">
                          Task 4 description here
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- STORY 1 -->
        <div class="title">
          <i class="dropdown icon"/>
          <span>Story 1</span>
          <div class="ui left pointing label yellow">
            IN-PROGRESS
          </div>
          <div class="ui buttons right floated compact">
            <button class="ui icon button"><i class="icon edit"/></button>
            <button class="ui icon button"><i class="icon trash"/></button>
          </div>
        </div>
        <div class="content">
          <div class="ui fluid container grid">
            <div class="row">
              <div class="eight wide column">
                Story 1 description here.
              </div>
              <div class="eight wide column">
                Story 1 stats here
              </div>
            </div>
            <div class="row">
              <div class="sixteen wide column">
                <hr>
                <span class="ui small header">Tasks (4)</span>
                <a class="ui right floated compact icon button">
                  <i class="plus icon"/>
                </a>
              </div>
            </div>
            <div class="row">
              <div class="sixteen wide column">
                <div class="ui three column stackable grid">
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 1 Card</div>
                        <div class="description">
                          Task 1 description here. Also buttons/links for edit/remove interactions will be here
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 2 Card</div>
                        <div class="description">
                          Task 2 description here. Will need to make sure height is consistent
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 3 Card</div>
                        <div class="description">
                          Task 3 description here
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui fluid card">
                      <div class="content">
                        <div class="header">Task 4 Card</div>
                        <div class="description">
                          Task 4 description here
                        </div>
                      </div>
                    </div>
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
      currentSprintId: ''
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
    }
  },
  watch: {
    currentSprint (newValue) {
      if (newValue) {
        setTimeout(() => {
          this.refreshAccordion()
        }, 50)
      }
    }
  },
  mounted () {
    $(this.$el).find('.ui.dropdown').dropdown()
    this.refreshAccordion()
  },
  methods: {
    refreshAccordion () {
      $(this.$el).find('.ui.accordion').accordion('refresh')
    }
  }
}
</script>

<style>
#sprint-viewer #task-story-listing>.header {
  margin-bottom: 1rem;
}
</style>
