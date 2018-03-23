<template>
  <div class="ui segments">
    <div class="ui inverted grey segment">
      <span class="ui header">Features ({{ numFeatures }})</span>
      <a
        @click="$emit('showmodal', 'feature-create')"
        class="ui right floated compact white inverted icon button">
        <i class="plus icon"/>
      </a>
    </div>
    <div
      v-if="release.features.length > 0"
      class="ui segment">
      <accordion-item
        v-for="featureId in release.features"
        :key="featureId"
        :id="`feature-list-${featureId}`"
        @toggle-accordion-state="toggleAccordionState"
        :name="`feature-list-${featureId}`"
        :showing-boolean="activeAccordion === `feature-list-${featureId}`">
        <section slot="title">
          <i class="dropdown icon"/>
          <span>{{ features[featureId].name }}</span>
          <div class="ui buttons right floated compact">
            <button
              @click.stop="featureEditHandler(featureId)"
              class="ui inverted violet icon button">
              <i class="icon edit"/>
            </button>
            <button
              @click.stop="featureRemoveHandler(featureId)"
              class="ui inverted red icon button">
              <i class="icon trash"/>
            </button>
          </div>
        </section>

        <section slot="content">
          {{ features[featureId].description }}
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
                :name="`${featureId}-extra-tasks`"
                :showing-boolean="activeSubAccordion === `${featureId}-extra-tasks`">
                <section slot="title">
                  <i class="dropdown icon"/>
                  <span>Extra Tasks</span>
                </section>
                <section slot="content">
                  <div class="ui fluid container grid">
                    <div class="row">
                      <div class="sixteen wide column">
                        <span class="ui small header">
                          Tasks ({{ getNumUnfinishedTasks(featureId) }}/{{ getFeatureTasks(featureId).length }} Remaining)
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
                            v-for="task in getFeatureTasks(featureId)"
                            :key="task.id"
                            :task="task"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </accordion-item>
              <accordion-item
                v-for="story in getFeatureStories(featureId)"
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
              </accordion-item>
            </div>
          </div>
        </section>
      </accordion-item>
    </div>
  </div>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Cards/SingleTaskCard'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

export default {
  components: {
    'task-card': SingleTaskCard,
    'accordion-item': SegmentAccordionItem
  },
  props: {
    release: {
      required: true,
      type: Object
    },
    features: {
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
      activeAccordion: '',
      activeSubAccordion: ''
    }
  },
  computed: {
    numFeatures () {
      return this.release.features.length
    }
  },
  watch: {
    release () {
      this.activeAccordion = ''
      this.activeSubAccordion = ''
    }
  },
  methods: {
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
      this.activeSubAccordion = ''
    },
    toggleAccordionSubState (field) {
      if (this.activeSubAccordion === field) {
        this.activeSubAccordion = ''
      } else {
        this.activeSubAccordion = field
      }
    },
    featureEditHandler (featureId) {
      console.debug('Clicked edit for', featureId)
    },
    featureRemoveHandler (featureId) {
      console.debug('Clicked remove for', featureId)
    },
    getFeatureTasks (featureId) {
      return this.features[featureId].tasks
        .map(id => this.tasks[id])
    },
    getNumUnfinishedTasks (featureId) {
      return this.getFeatureTasks(featureId)
        .filter(task => task.status !== 'done').length
    },
    getFeatureStories (featureId) {
      return this.features[featureId].stories
        .map(id => this.stories[id])
    },
    storyEditHandler (storyId) {
      console.debug('Clicked edit for', storyId)
    },
    storyRemoveHandler (storyId) {
      console.debug('Clicked remove for', storyId)
    }
  }
}
</script>
