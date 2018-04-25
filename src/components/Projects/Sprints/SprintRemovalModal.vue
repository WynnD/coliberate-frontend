<template>
  <div class="ui modal form">
    <div class="header">Remove Sprint Confirmation</div>
    <div
      v-if="targetSprint"
      class="scrolling content">
      <h3>Are you sure you want to remove {{ targetSprint.name }}?</h3>
      <p><b>Date Range: </b> {{ getDateRange(targetSprint) }}</p>
      <div v-if="targetSprint.stories.length > 0 || targetSprint.tasks.length > 0">
        <p>The following will be put into the backlog if they aren't associated with anything else</p>
        <accordion-item
          v-if="targetSprint.tasks.length > 0"
          @toggle-accordion-state="toggleAccordionState"
          :name="`${targetSprint.id}-extra-tasks`"
          :showing-boolean="activeAccordion === `${targetSprint.id}-extra-tasks`">
          <section slot="title">
            <i class="dropdown icon"/>
            <span>Tasks</span>
          </section>
          <section slot="content">
            <div class="ui fluid container grid">
              <div class="row">
                <div class="sixteen wide column">
                  <span class="ui small header">
                    Tasks ({{ numUnfinishedTasks }}/{{ sprintTasks.length }} Remaining)
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="sixteen wide column">
                  <div class="ui three stackable cards">
                    <task-card
                      v-for="task in sprintTasks"
                      :key="task.id"
                      :show-buttons="false"
                      :task="task"/>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </accordion-item>
        <div v-if="targetSprint.stories.length > 0">
          <story-accordion-item
            v-for="story in sprintStories"
            :key="story.id"
            @toggle-accordion-state="toggleAccordionState"
            :story="story"
            :tasks="tasks"
            :name="`${targetSprintId}-list-${story.id}`"
            :show-buttons="false"
            :showing-boolean="activeAccordion === `${targetSprintId}-list-${story.id}`"
          />
        </div>
      </div>
      <div v-else>
        <p>No associated stories or tasks found with this sprint.</p>
      </div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui red button">
        Remove Sprint
      </button>
      <div class="ui grey cancel button">Cancel</div>
    </div>
  </div>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'
import StoryAccordionItem from '@/components/Projects/Stories/StoryAccordionItem'

export default {
  components: {
    'task-card': SingleTaskCard,
    'accordion-item': SegmentAccordionItem,
    'story-accordion-item': StoryAccordionItem
  },
  props: {
    releases: {
      required: true,
      type: Object
    },
    targetSprintId: {
      required: false,
      type: String,
      default: ''
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
      activeAccordion: ''
    }
  },
  computed: {
    targetSprint () {
      return this.sprints[this.targetSprintId]
    },
    sprintStories () {
      return this.targetSprint.stories
        .map(id => this.stories[id])
    },
    sprintTasks () {
      return this.targetSprint.tasks
        .map(id => this.tasks[id])
    },
    numUnfinishedTasks () {
      return this.sprintTasks.filter(task => task.status !== 'done').length
    }
  },
  methods: {
    getDateRange (sprint) {
      const startDate = new Date(sprint.startDate)
      const endDate = new Date(sprint.endDate)
      return `${startDate.toDateString()} to ${endDate.toDateString()}`
    },
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
