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
        {{ tasks_finished }}/{{ num_tasks }} Completed
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
        {{ stories_finished }}/{{ num_stories }} Completed
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
      num_tasks: 0,
      tasks_finished: 0,
      num_stories: 0,
      stories_finished: 0,
      features: {
        'Homepage': 80,
        'User Support': 53,
        'Security': 13
      }
    }
  },
  watch: {
    num_tasks () {
      this.updateTasksProgress()
    },
    tasks_finished () {
      this.updateTasksProgress()
    },
    num_stories () {
      this.updateStoriesProgress()
    },
    stories_finished () {
      this.updateStoriesProgress()
    }
  },
  mounted () {
    this.updateProgress()
  },
  methods: {
    updateProgress () {
      this.num_tasks = 20
      this.tasks_finished = 17
      this.num_stories = 7
      this.stories_finished = 5
    },
    updateTasksProgress () {
      let tasksProgress = $('#tasks-progress .progress')
      tasksProgress.progress({
        total: this.num_tasks /* tasks.length */,
        value: this.tasks_finished /* numFinished() */,
        showActivity: false})
    },
    updateStoriesProgress () {
      let storiesProgress = $('#stories-progress .progress')
      storiesProgress.progress({
        total: this.num_stories,
        value: this.stories_finished,
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
