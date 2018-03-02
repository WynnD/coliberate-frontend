<template>
  <div class="content">
    <span class="ui sub header">Summary</span>
    <div class="ui small segments">
      <div id="task-progress" class="ui segment">
        <div class="ui progress" :data-percent="task_finished_percent">
          <div class="bar finished"/>
        </div>
        <div class="ui progress">
          <div class="bar unfinished"/>
        </div>
        <span class="ui sub header">17/20 Completed</span>
      </div>
      <div id="story-progress" class="ui segment">
        <div class="ui progress">
          <div class="bar finished"/>
        </div>
        <div class="ui progress">
          <div class="bar unfinished"/>
        </div>
        <span class="ui sub header">17/20 Completed</span>
      </div>
      <div id="task-progress" class="segment ui">
        feature progress goes here
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: {
    task_finished_percent: 50
  },
  mounted () {
    let task_progress = $('#task-progress')

  }
}
</script>

<style scoped>
.ui.progress {
  background: none
}

.ui.progress .finished {
  background: #0D0;
}

.ui.progress .unfinished {
  background: #E00;
}

.ui.progress {
  display: inline-block
}

.progress .header {
  font-weight: normal
}
</style>
