<template>
  <accordion-item
    :id="`feature-list-${feature.id}`"
    @toggle-accordion-state="toggleAccordionState"
    :name="`feature-list-${feature.id}`"
    @click.native="$emit('changefeature', feature.id)"
    :showing-boolean="activeAccordion === `feature-list-${feature.id}`">
    <section slot="title">
      <i class="dropdown icon"/>
      <span>{{ feature.name }}</span>
      <div
        v-if="showButtons"
        class="ui buttons right floated compact">
        <button
          @click.stop="featureEditHandler"
          class="ui inverted violet icon button">
          <i class="icon edit"/>
        </button>
        <button
          @click.stop="featureRemoveHandler"
          class="ui inverted red icon button">
          <i class="icon trash"/>
        </button>
      </div>
    </section>

    <section slot="content">
      {{ feature.description }}
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
            :name="`${feature.id}-extra-tasks`"
            :showing-boolean="activeSubAccordion === `${feature.id}-extra-tasks`"
            :assigned-task-list="feature.tasks"
            :all-tasks="tasks"
            :show-buttons="showButtons"
            :project-id="projectId"
            @toggle-accordion-state="toggleAccordionSubState"
            @showmodal="showModal"
            @update="$emit('update')"
          />
          <story-accordion-item
            v-for="story in featureStories"
            :key="story.id"
            @toggle-accordion-state="toggleAccordionSubState"
            :name="`${feature.id}-list-${story.id}`"
            :story="story"
            :tasks="tasks"
            :show-buttons="showButtons"
            :project-id="projectId"
            :showing-boolean="activeSubAccordion === `${feature.id}-list-${story.id}`"
            @showmodal="showModal"
            @update="$emit('update')"
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
    feature: {
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
    featureTasks () {
      return this.feature.tasks
        .map(id => this.tasks[id])
    },
    numUnfinishedTasks () {
      return this.featureTasks.filter(task => task.status !== 'done').length
    },
    featureStories () {
      return this.feature.stories
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
    featureEditHandler () {
      console.debug('Clicked edit for', this.feature.id)
    },
    featureRemoveHandler () {
      console.debug('Clicked remove for', this.feature.id)
      this.$emit('showmodal', `feature-remove|${this.feature.id}`)
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
      this.$emit('changefeature', this.feature.id)
      this.$emit('showmodal', data)
    },
    changeStory (data) {
      this.$emit('changestory', data)
    }
  }
}
</script>

<style>
#task-story-listing>.header {
  margin-bottom: 1rem;
}
</style>
