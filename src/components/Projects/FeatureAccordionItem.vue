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
          <accordion-item
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
          </accordion-item>
          <story-accordion-item
            v-for="story in featureStories"
            :key="story.id"
            @toggle-accordion-state="toggleAccordionSubState"
            :name="`${feature.id}-list-${story.id}`"
            :story="story"
            :tasks="tasks"
            :showing-boolean="activeSubAccordion === `${feature.id}-list-${story.id}`"
          />
          <!-- <accordion-item
            v-for="story in featureStories"
            :key="story.id"
            @toggle-accordion-state="toggleAccordionSubState"
            :name="`${featureId}-list-${story.id}`"
            :showing-boolean="activeSubAccordion === `${featureId}-list-${story.id}`">
            <section slot="title">
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
                <button
                  @click.stop="storyEditHandler(story.id)"
                  class="ui inverted violet icon button">
                  <i class="icon edit"/>
                </button>
                <button
                  @click.stop="storyRemoveHandler(story.id)"
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
                    {{ story.name }} stats here
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
            </section>
          </accordion-item> -->
        </div>
      </div>
    </section>
  </accordion-item>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Cards/SingleTaskCard'
import StoryAccordionItem from '@/components/Projects/StoryAccordionItem'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

export default {
  components: {
    'task-card': SingleTaskCard,
    'story-accordion-item': StoryAccordionItem,
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
