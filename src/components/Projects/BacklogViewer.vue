<template>
  <div
    id="backlog-viewer"
    class="ui segments">
    <div
      id="backlog-header"
      @click="showBacklog = !showBacklog"
      :class="{
        'ui segment inverted': true,
        'active-backlog': showBacklog
      }"
    >
      <i class="dropdown icon"/>
      <span class="ui header">Backlog/Sandbox</span>
      <span class="ui left pointing label">
        {{ numBackLogItems }} Backlog Items Found
      </span>
    </div>

    <div
      v-show="showBacklog"
      class="ui segment">
      All items shown here aren't properly associated with specific parts of the project.
      This could be due to creating an item without assigning it to its respective release,
      sprint, or story, or deleting an item, making its child items unasssociated.
    </div>

    <div
      v-show="showBacklog"
      class="ui segment">
      <div class="backlog-entry-title">
        <span class="ui medium header">Features</span>
        <a class="ui right floated compact icon button">
          <i class="plus icon"/>
        </a>
      </div>
      <div v-if="orphanedData.features.length === 0">
        <div class="ui message positive">
          <div class="header">No unassociated features found</div>
          <p>No action necessary</p>
        </div>
      </div>
      <div v-else>
        <div class="ui message negative">
          <div class="header">Unassociated Features Found</div>
          <p><b>Suggested Action:</b> Edit these features so that they belong to a release.</p>
        </div>
      </div>
      <feature-accordion-item
        v-for="featureId in orphanedData.features"
        :key="featureId"
        :id="`backlog-features-${featureId}`"
        :feature="project.features[featureId]"
        :active-accordion="activeAccordion"
        @toggle-accordion-state="toggleAccordionState"
        :name="`backlog-features-${featureId}`"
        :stories="project.stories"
        :tasks="project.tasks"
      />
    </div>

    <div
      v-show="showBacklog"
      v-if="orphanedData.sprints.length > 0"
      class="ui segment">
      <span class="ui header medium">Sprints</span>
      <div v-if="orphanedData.sprints.length === 0">
        <div class="ui message positive">
          <div class="header">No unassociated sprints found</div>
          <p>No action necessary</p>
        </div>
      </div>
      <div v-else>
        <div class="ui message negative">
          <div class="header">Unassociated Sprints Found</div>
          <p><b>Suggested Action:</b> Edit these sprints so that they belong to a release.</p>
        </div>
      </div>
      <accordion-item
        v-for="sprintId in orphanedData.sprints"
        :key="sprintId"
        :id="`backlog-sprints-${sprintId}`"
        @toggle-accordion-state="toggleAccordionState"
        :name="`backlog-sprints-${sprintId}`"
        :showing-boolean="activeAccordion === `backlog-sprints-${sprintId}`">
        <section slot="title">
          <i class="dropdown icon"/>
          <span>{{ project.sprints[sprintId].name }}</span>
          <div class="ui buttons right floated compact">
            <button
              @click.stop="sprintEditHandler(sprintId)"
              class="ui inverted violet icon button">
              <i class="icon edit"/>
            </button>
            <button
              @click.stop="sprintRemoveHandler(sprintId)"
              class="ui inverted red icon button">
              <i class="icon trash"/>
            </button>
          </div>
        </section>

        <section slot="content">
          {{ project.sprints[sprintId].startDate }} to {{ project.sprints[sprintId].endDate }}
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
                :name="`backlog-sprints-${sprintId}-extra-tasks`"
                :showing-boolean="activeSubAccordion === `backlog-sprints-${sprintId}-extra-tasks`">
                <section slot="title">
                  <i class="dropdown icon"/>
                  <span>Extra Tasks</span>
                </section>
                <section slot="content">
                  <div class="ui fluid container grid">
                    <div class="row">
                      <div class="sixteen wide column">
                        <span class="ui small header">
                          Tasks
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
                            v-for="task in getSprintTasks(sprintId)"
                            :key="task.id"
                            :task="task"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </accordion-item>
              <accordion-item
                v-for="story in getSprintStories(sprintId)"
                :key="story.id"
                @toggle-accordion-state="toggleAccordionSubState"
                :name="`sprint-${sprintId}-list-${story.id}`"
                :showing-boolean="activeSubAccordion === `sprint-${sprintId}-list-${story.id}`">
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

    <div
      v-show="showBacklog"
      class="ui segment">
      <div class="backlog-entry-title">
        <span class="ui medium header">Stories</span>
        <a class="ui right floated compact icon button">
          <i class="plus icon"/>
        </a>
      </div>
      <div v-if="orphanedData.stories.length === 0">
        <div class="ui message positive">
          <div class="header">No unassociated stories found</div>
          <p>No action necessary</p>
        </div>
      </div>
      <div v-else>
        <div class="ui message negative">
          <div class="header">Unassociated Stories Found</div>
          <p><b>Suggested Action:</b> Edit these stories so that they belong to a sprint.</p>
        </div>
      </div>
      <accordion-item
        v-for="storyId in orphanedData.stories"
        :key="storyId"
        @toggle-accordion-state="toggleAccordionSubState"
        :name="`story-list-${storyId}`"
        :showing-boolean="activeSubAccordion === `story-list-${storyId}`">
        <section slot="title">
          <i class="dropdown icon"/>
          <span>{{ project.stories[storyId].name }}</span>
          <div
            :class="{
              'ui left pointing label story-status': true,
              yellow: project.stories[storyId].status === 'in-progress',
              green: project.stories[storyId].status === 'done',
              red: project.stories[storyId].status === 'todo'
            }"
          >
            {{ project.stories[storyId].status.toUpperCase() }}
          </div>
          <div class="ui buttons right floated compact">
            <button
              @click.stop="storyEditHandler(project.stories[storyId].id)"
              class="ui inverted violet icon button">
              <i class="icon edit"/>
            </button>
            <button
              @click.stop="storyRemoveHandler(project.stories[storyId].id)"
              class="ui inverted red icon button">
              <i class="icon trash"/>
            </button>
          </div>
        </section>

        <section slot="content">
          <div class="ui fluid container grid">
            <div class="row">
              <div class="eight wide column">
                {{ project.stories[storyId].description }}
              </div>
              <div class="eight wide column">
                {{ project.stories[storyId].name }} stats here
              </div>
            </div>
            <div class="row">
              <div class="sixteen wide column">
                <hr>
                <span class="ui small header">Tasks ({{ project.stories[storyId].tasks.length }})</span>
                <a class="ui right floated compact icon button">
                  <i class="plus icon"/>
                </a>
              </div>
            </div>
            <div class="row">
              <div class="sixteen wide column">
                <span v-if="project.stories[storyId].tasks.length === 0">No tasks found</span>
                <div
                  v-else
                  class="ui three stackable cards">
                  <task-card
                    v-for="taskId in project.stories[storyId].tasks"
                    :key="taskId"
                    :task="tasks[taskId]"/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </accordion-item>
    </div>

    <div
      v-show="showBacklog"
      class="ui segment">
      <div class="backlog-entry-title">
        <span class="ui medium header">Tasks</span>
        <a class="ui right floated compact icon button">
          <i class="plus icon"/>
        </a>
      </div>
      <div v-if="orphanedData.tasks.length === 0">
        <div class="ui message positive">
          <div class="header">No unassociated tasks found</div>
          <p>No action necessary</p>
        </div>
      </div>
      <div v-else>
        <div class="ui message negative">
          <div class="header">Unassociated Tasks Found</div>
          <p><b>Suggested Action:</b> Edit these tasks so that they belong to a story or a sprint.</p>
        </div>
      </div>
      <br>
      <div class="ui three stackable cards">
        <task-card
          v-for="taskId in orphanedData.tasks"
          :key="taskId"
          :task="project.tasks[taskId]"/>
      </div>
    </div>
  </div>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

export default {
  components: {
    'task-card': SingleTaskCard,
    'feature-accordion-item': FeatureAccordionItem,
    'accordion-item': SegmentAccordionItem
  },
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      activeAccordion: '',
      activeSubAccordion: '',
      showBacklog: false
    }
  },
  computed: {
    usedData () {
      const usedData = {
        features: [],
        sprints: [],
        stories: [],
        tasks: []
      }

      usedData.features = Object.keys(this.project.releases)
        .map(r => this.project.releases[r].features)
        .reduce((acc, val) => acc.concat(val), [])

      usedData.sprints = Object.keys(this.project.releases)
        .map(r => this.project.releases[r].sprints)
        .reduce((acc, val) => acc.concat(val), [])

      // aggregate stories
      const sprintStories = Object.keys(this.project.sprints)
        .map(s => this.project.sprints[s].stories)
        .reduce((acc, val) => acc.concat(val), [])
      // const featureStories = Object.keys(this.project.features)
      //   .map(f => this.project.features[f].stories)
      //   .reduce((acc, val) => acc.concat(val), [])
      // sprintStories.concat(featureStories)
      sprintStories.forEach((id) => {
        if (usedData.stories.indexOf(id) === -1) {
          usedData.stories.push(id)
        }
      })

      // aggregate tasks
      const sprintTasks = Object.keys(this.project.sprints)
        .map(s => this.project.sprints[s].tasks)
        .reduce((acc, val) => acc.concat(val), [])
      // const featureTasks = Object.keys(this.project.features)
      //   .map(f => this.project.features[f].tasks)
      //   .reduce((acc, val) => acc.concat(val), [])
      const storyTasks = Object.keys(this.project.stories)
        .map(s => this.project.stories[s].tasks)
        .reduce((acc, val) => acc.concat(val), [])
      sprintTasks.concat(storyTasks)
        .forEach((id) => {
          if (usedData.tasks.indexOf(id) === -1) {
            usedData.tasks.push(id)
          }
        })

      return usedData
    },
    orphanedData () {
      return {
        features: Object.keys(this.project.features)
          .filter(id => this.usedData.features.indexOf(id) === -1),
        sprints: Object.keys(this.project.sprints)
          .filter(id => this.usedData.sprints.indexOf(id) === -1),
        stories: Object.keys(this.project.stories)
          .filter(id => this.usedData.stories.indexOf(id) === -1),
        tasks: Object.keys(this.project.tasks)
          .filter(id => this.usedData.tasks.indexOf(id) === -1)
      }
    },
    numBackLogItems () {
      return Object.keys(this.orphanedData)
        .map(key => this.orphanedData[key].length > 0)
        .filter(val => !!val).length
    },
    hasBacklogItems () {
      return this.numBackLogItems.length > 0
    }
  },
  mounted () {
    this.showBacklog = this.hasBacklogItems
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
      return this.project.features[featureId].tasks
        .map(id => this.project.tasks[id])
    },
    getNumUnfinishedTasks (featureId) {
      return this.getFeatureTasks(featureId)
        .filter(task => task.status !== 'done').length
    },
    getFeatureStories (featureId) {
      return this.project.features[featureId].stories
        .map(id => this.project.stories[id])
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
    getSprintTasks (sprintId) {
      return this.project.sprints[sprintId].tasks
        .map(id => this.project.tasks[id])
    },
    getSprintStories (sprintId) {
      return this.project.sprints[sprintId].stories
        .map(id => this.project.stories[id])
    }
  }
}
</script>

<style>
#backlog-header {
  background-color: #999;
}

#backlog-header:hover {
  cursor: pointer;
  background-color: #888;
}

#backlog-header.active-backlog:not(:hover) {
  background-color: #777;
}

#backlog-header .icon.dropdown {
  transform: rotate(-90deg);
}

#backlog-header.active-backlog .icon.dropdown {
  transform: rotate(0deg);
}

.backlog-entry-title {
  margin-bottom: 1rem;
}
</style>
