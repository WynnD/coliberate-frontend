<template>
  <accordion-item
    :id="`feature-list-${feature.id}`"
    @toggle-accordion-state="toggleAccordionState"
    :name="`feature-list-${feature.id}`"
    :showing-boolean="activeAccordion === `feature-list-${feature.id}`">
    <section slot="title">
      <i class="dropdown icon"/>
      <span>{{ feature.name }}</span>
      <div class="ui buttons right floated compact">
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
          <a class="ui right floated compact icon button">
            <i class="plus icon"/>
          </a>
        </div>
        <div>
          <extra-tasks-accordion-item
            :name="`${feature.id}-extra-tasks`"
            :showing-boolean="activeSubAccordion === `${feature.id}-extra-tasks`"
            :assigned-task-list="feature.tasks"
            :all-tasks="tasks"
            @toggle-accordion-state="toggleAccordionSubState"
          />
          <!-- <accordion-item
            @toggle-accordion-state="toggleAccordionSubState"
            :name="`${feature.id}-extra-tasks`"
            :showing-boolean="activeSubAccordion === `${feature.id}-extra-tasks`">
            <section slot="title">
              <i class="dropdown icon"/>
              <span>Extra Tasks</span>
            </section>
            <section slot="content">
              <div class="ui fluid container grid">
                <div class="row">
                  <div class="sixteen wide column">
                    <span class="ui small header">
                      Tasks ({{ numUnfinishedTasks }}/{{ featureTasks.length }} Remaining)
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
                        v-for="task in featureTasks"
                        :key="task.id"
                        :task="task"/>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </accordion-item> -->
          <story-accordion-item
            v-for="story in featureStories"
            :key="story.id"
            @toggle-accordion-state="toggleAccordionSubState"
            :name="`${feature.id}-list-${story.id}`"
            :story="story"
            :tasks="tasks"
            :showing-boolean="activeSubAccordion === `${feature.id}-list-${story.id}`"
          />
        </div>
      </div>
    </section>
  </accordion-item>
</template>

<script>
import StoryAccordionItem from '@/components/Projects/StoryAccordionItem'
import ExtraTasksAccordionItem from '@/components/Projects/ExtraTasksAccordionItem'
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
  methods: {
    featureEditHandler () {
      console.debug('Clicked edit for', this.feature.id)
    },
    featureRemoveHandler () {
      console.debug('Clicked remove for', this.feature.id)
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
    }
  }
}
</script>
