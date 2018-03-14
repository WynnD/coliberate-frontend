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
        {{ tasksFinished }}/{{ numTasks }} Completed
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
        {{ storiesFinished }}/{{ numStories }} Completed
      </p>
    </div>
    <div
      id="features-progress"
      class="content">
      <p class="ui sub header">Features</p>
      <table class="ui very basic celled table">
        <tbody>
          <tr
            v-for="(percent, name) in features"
            :key="name">
            <td>{{ name }}</td>
            <td>{{ percent }}%</td>
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
  data () {
    return {
      numTasks: 0,
      tasksFinished: 0,
      numStories: 0,
      storiesFinished: 0,
      features: {
        'Homepage': 80,
        'User Support': 53,
        'Security': 13
      }
    }
  },
  watch: {
    numTasks () {
      this.updateTasksProgress()
    },
    tasksFinished () {
      this.updateTasksProgress()
    },
    numStories () {
      this.updateStoriesProgress()
    },
    storiesFinished () {
      this.updateStoriesProgress()
    }
  },
  mounted () {
    this.updateProgress()
  },
  methods: {
    updateProgress () {
      this.numTasks = 20
      this.tasksFinished = 17
      this.numStories = 7
      this.storiesFinished = 5
    },
    updateTasksProgress () {
      let tasksProgress = $('#tasks-progress .progress')
      tasksProgress.progress({
        total: this.numTasks /* tasks.length */,
        value: this.tasksFinished /* numFinished() */,
        showActivity: false})
    },
    updateStoriesProgress () {
      let storiesProgress = $('#stories-progress .progress')
      storiesProgress.progress({
        total: this.numStories,
        value: this.storiesFinished,
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
