<template>
  <accordion-item
    @toggle-accordion-state="handleToggleAccordionState"
    :name="name"
    :showing-boolean="showingBoolean">
    <section slot="title">
      <i class="dropdown icon"/>
      <span>{{ story.name }} ({{ story.businessValue }} pts)</span>
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
      <div
        v-if="showButtons"
        class="ui buttons right floated compact">
        <button
          @click.stop="storyEditHandler"
          class="ui inverted violet icon button">
          <i class="icon edit"/>
        </button>
        <button
          @click.stop="storyRemoveHandler"
          class="ui inverted red icon button">
          <i class="icon trash"/>
        </button>
      </div>
    </section>

    <section slot="content">
      <div class="ui fluid container grid">
        <div class="row">
          <div class="eight wide column">
            {{ story.description }}
          </div>
          <div class="eight wide column">
            <progress-bar
              :done-count="finishedTasks.length"
              :in-progress-count="inProgressTasks.length"
              :total-count="storyTasks.length"/>
            <p class="ui sub header aligned right">
              {{ finishedTasks.length }}/{{ storyTasks.length }} Completed
            </p>
          </div>
        </div>
        <div class="row">
          <div class="sixteen wide column">
            <hr>
            <span class="ui small header">Tasks ({{ story.tasks.length }})</span>
            <a
              v-if="showButtons"
              @click="$emit('showmodal', 'task-create')"
              class="ui right floated compact icon button">
              <i class="plus icon"/>
              Add Task
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
                v-for="task in storyTasks"
                :key="task.id"
                :show-buttons="showButtons"
                :project-id="projectId"
                @showmodal="showModal"
                @update="$emit('update')"
                :task="task"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  </accordion-item>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'
import ProgressBar from '@/components/Projects/ProgressBar'

export default {
  components: {
    'task-card': SingleTaskCard,
    'accordion-item': SegmentAccordionItem,
    'progress-bar': ProgressBar
  },
  props: {
    story: {
      required: true,
      type: Object
    },
    name: {
      required: true,
      type: String
    },
    showingBoolean: {
      required: true,
      type: Boolean
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
  computed: {
    storyTasks () {
      return this.story.tasks.map(id => this.tasks[id])
    },
    finishedTasks () {
      return this.storyTasks.filter(t => t.status === 'done')
    },
    inProgressTasks () {
      return this.storyTasks.filter(t => t.status === 'in-progress')
    }
  },
  watch: {
    showingBoolean (doShow) {
      setTimeout(() => {
        console.debug('changestory', this.story.id)
        this.$emit('changestory', doShow ? this.story.id : '')
      }, doShow ? 100 : 25)
    },
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
    handleToggleAccordionState (name) {
      this.$emit('toggle-accordion-state', name)
    },
    storyEditHandler () {
      console.debug('Clicked edit for', this.story.id)
    },
    storyRemoveHandler () {
      console.debug('Clicked remove for', this.story.id)
      this.$emit('showmodal', `story-remove|${this.story.id}`)
    },
    showModal (data) {
      this.$emit('showmodal', data)
    }
  }
}
</script>
