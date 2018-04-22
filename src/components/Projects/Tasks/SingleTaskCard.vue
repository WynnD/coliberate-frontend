<template>
  <div
    id="single-task-card"
    class="ui fluid task-card card">
    <div class="content">
      <div class="header">{{ task.name }}</div>
      <div class="header">
        <div :class="ribbonClass">{{ task.status.toUpperCase() }}</div>
        <span class="left floated">
          ({{ task.points }} points)
        </span>
      </div>
      <div class="description">
        <p><b>Description:</b></p>
        <p>
          {{ task.description }}
        </p>
      </div>
      <hr>
      <div class="description">
        <div class="ui sub header">Taken By:</div>
        <span v-if="task.takenBy.length === 0">Nobody</span>
        <span v-else>
          {{ memberNames.join(', ') }}
        </span>
      </div>
    </div>
    <div class="extra content">
      <slot>
        <button
          v-if="!isTaken"
          class="ui fluid button">
          Take this task
        </button>
        <button
          v-else
          class="ui fluid button">
          Drop this task
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    task: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapGetters(['memberById', 'currentUser']),
    ribbonClass () {
      const status = this.task.status.toLowerCase()
      return {
        'ui right ribbon label': true,
        red: status === 'todo',
        yellow: status === 'in-progress',
        green: status === 'done'
      }
    },
    memberNames () {
      return this.task.takenBy
        .map(id => this.memberById(id) || { name: `Unknown (${id})` })
        .map(m => m.name)
    },
    isTaken () {
      return this.task.takenBy.indexOf(this.currentUser.id) > -1
    }
  }
}
</script>

<style>
#single-task-card .header .left.floated {
  margin-right: -20rem;
}
</style>
