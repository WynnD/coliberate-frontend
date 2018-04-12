<template>
  <div
    id="single-task-card"
    class="ui fluid card">
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
        Maybe have button to take/drop task here?
      </slot>
    </div>
  </div>
</template>

<script>
import getters from '@/store/getters'

export default {
  props: {
    task: {
      required: true,
      type: Object
    }
  },
  computed: {
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
        .map(id => getters.memberById(this.$store.state)(id) || { name: `Unknown (${id})` })
        .map(m => m.name)
    }
  }
}
</script>

<style>
#single-task-card .header .left.floated {
  margin-right: -20rem;
}
</style>
