<template>
  <div class="ui card">
    <div class="content">
      <span class="header">Overview</span>
    </div>
    <div
      id="tasks-progress"
      class="content">
      <p class="ui sub header">Tasks</p>
      <div class="ui green progress">
        <div class="bar finished"/>
      </div>
      <p class="ui sub header aligned right">
        {{ finishedTasks.length }}/{{ allTasks.length }} Completed
      </p>
    </div>
    <div
      id="stories-progress"
      class="content">
      <p class="ui sub header">Stories</p>
      <div class="ui green progress">
        <div class="bar finished"/>
      </div>
      <p class="ui sub header aligned right">
        {{ finishedStories.length }}/{{ allStories.length }} Completed
      </p>
    </div>
    <div
      id="features-progress"
      class="content">
      <p class="ui sub header">Features</p>
      <table class="ui very basic celled table">
        <tbody>
          <tr
            v-for="feature in featureProgress"
            :key="feature.id">
            <td>{{ feature.name }}</td>
            <td>{{ feature.percent }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

/* global $ */
export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  computed: {
    allTasks () {
      return Object.values(this.project.tasks)
    },
    finishedTasks () {
      return this.allTasks.filter(t => t.status === 'done')
    },
    allStories () {
      return Object.values(this.project.stories)
    },
    finishedStories () {
      return this.allStories.filter(s => s.status === 'done')
    },
    allFeatures () {
      return Object.values(this.project.features)
    },
    featureProgress () {
      return this.allFeatures.map(f => {
        const stories = f.stories.map(id => this.project.stories[id])
        const finishedStories = stories.filter(s => s.status === 'done')

        const tasks = f.tasks.map(id => this.project.tasks[id])
        const finishedTasks = tasks.filter(t => t.status === 'done')

        const progress = ((finishedStories.length + finishedTasks.length) / (stories.length + tasks.length)) * 100
        return {
          name: f.name || f.id,
          percent: !isNaN(progress) ? `${progress.toFixed(2)}%` : 'N/A'
        }
      })
    }
  },
  watch: {
    allTasks () {
      this.updateTasksProgress()
    },
    finishedTasks () {
      this.updateTasksProgress()
    },
    allStories () {
      this.updateStoriesProgress()
    },
    finishedStories () {
      this.updateStoriesProgress()
    }
  },
  mounted () {
    this.updateTasksProgress()
    this.updateStoriesProgress()
  },
  methods: {
    updateTasksProgress () {
      let tasksProgress = $('#tasks-progress .progress')
      tasksProgress.progress({
        total: this.allTasks.length,
        value: this.finishedTasks.length,
        showActivity: false})
    },
    updateStoriesProgress () {
      let storiesProgress = $('#stories-progress .progress')
      storiesProgress.progress({
        total: this.allStories.length,
        value: this.finishedStories.length,
        showActivity: false
      })
    }
  }
}
</script>

<style scoped>
.ui.progress {
  background: red;
  margin-bottom: 0.5em;
}

.ui.progress .bar {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* Make Progress Count FLoat Right by adding "floated right" classes
*/
.progress .header {
  font-weight: normal;
  text-align: right;
}
</style>
