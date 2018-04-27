<template>
  <accordion-item
    :id="`sprint-accordion-${sprint.id}`"
    @toggle-accordion-state="toggleAccordionState"
    :name="`sprint-accordion-${sprint.id}`"
    :showing-boolean="activeAccordion === `sprint-accordion-${sprint.id}`">
    <section slot="title">
      <i class="dropdown icon"/>
      <span>{{ sprint.name }}</span>
      <div
        v-if="showButtons"
        class="ui buttons right floated compact">
        <button
          @click.stop="sprintEditHandler"
          class="ui inverted violet icon button">
          <i class="icon edit"/>
        </button>
        <button
          @click.stop="sprintRemoveHandler"
          class="ui inverted red icon button">
          <i class="icon trash"/>
        </button>
      </div>
    </section>

    <section slot="content">
      {{ sprint.startDate }} to {{ sprint.endDate }}
      <hr>
      <div
        id="task-story-listing"
        class="ui segment">
        <div class="header">
          <span class="ui header medium">Tasks and Stories</span>
          <a
            v-if="showButtons"
            @click="showModal('story-create')"
            class="ui right floated compact icon button">
            <i class="plus icon"/>
            Add Story
          </a>
        </div>
        <div>
          <extra-tasks-accordion-item
            :name="`${sprint.id}-extra-tasks`"
            :showing-boolean="activeSubAccordion === `${sprint.id}-extra-tasks`"
            :assigned-task-list="sprint.tasks"
            :all-tasks="tasks"
            :show-buttons="showButtons"
            :project-id="projectId"
            @update="$emit('update')"
            @toggle-accordion-state="toggleAccordionSubState"
            @showmodal="showModal"
          />
          <story-accordion-item
            v-for="story in sprintStories"
            :key="story.id"
            @toggle-accordion-state="toggleAccordionSubState"
            :name="`${sprint.id}-list-${story.id}`"
            :story="story"
            :tasks="tasks"
            :show-buttons="showButtons"
            :project-id="projectId"
            @update="$emit('update')"
            :showing-boolean="activeSubAccordion === `${sprint.id}-list-${story.id}`"
            @showmodal="showModal"
            @changestory="changeStory"
          />
        </div>
      </div>
    </section>
  </accordion-item>
</template>

<script>
import StoryAccordionItem from '@/components/Projects/Stories/StoryAccordionItem'
import ExtraTasksAccordionItem from '@/components/Projects/Tasks/ExtraTasksAccordionItem'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

export default {
  components: {
    'story-accordion-item': StoryAccordionItem,
    'extra-tasks-accordion-item': ExtraTasksAccordionItem,
    'accordion-item': SegmentAccordionItem
  },
  props: {
    sprint: {
      required: true,
      type: Object
    },
    activeAccordion: {
      required: true,
      type: String
    },
    stories: {
      required: true,
      type: Object
    },
    tasks: {
      required: true,
      type: Object
    },
    showButtons: {
      required: false,
      type: Boolean,
      default: true
    },
    projectId: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeSubAccordion: ''
    }
  },
  computed: {
    sprintTasks () {
      return this.sprint.tasks
        .map(id => this.tasks[id])
    },
    numUnfinishedTasks () {
      return this.sprintTasks.filter(task => task.status !== 'done').length
    },
    sprintStories () {
      return this.sprint.stories
        .map(id => this.stories[id])
    }
  },
  watch: {
    projectId () {
      this.checkProjectId()
    }
  },
  mounted () {
    this.checkProjectId()
  },
  methods: {
    checkProjectId () {
      if (this.showButtons && !this.projectId) {
        console.warn('no project id specified')
      }
    },
    sprintEditHandler () {
      console.debug('Clicked edit for', this.sprint.id)
    },
    sprintRemoveHandler () {
      console.debug('Clicked remove for', this.sprint.id)
      this.$emit('showmodal', `sprint-remove|${this.sprint.id}`)
    },
    toggleAccordionState (name) {
      this.$emit('toggle-accordion-state', name)
    },
    toggleAccordionSubState (field) {
      if (this.activeSubAccordion === field) {
        this.activeSubAccordion = ''
      } else {
        this.activeSubAccordion = field
      }
    },
    showModal (data) {
      this.$emit('changesprint', this.sprint.id)
      this.$emit('showmodal', data)
    },
    changeStory (data) {
      this.$emit('changestory', data)
    }
  }
}
</script>
