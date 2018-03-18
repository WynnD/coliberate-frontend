<template>
  <div class="ui fluid card">
    <div class="content">
      <div class="header">{{ task.name }}</div>
      <div class="header">
        ({{ task.points }} points)
      </div>
      <div class="description">
        <div :class="ribbonClass">{{ task.status.toUpperCase() }}</div>
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
        Maybe make status more prominent here?
      </slot>
    </div>
  </div>
</template>

<script>
import { getters } from '@/store'

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
        'ui ribbon label': true,
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
