<template>
  <div class="ui fluid card">
    <div class="content">
      <div class="header">{{ task.name }}</div>
      <div class="header">({{ task.points }} points)</div>
      <div class="meta">
        <b>Status:</b> {{ task.status }}
      </div>
      <div class="description">
        {{ task.description }}
      </div>
      <div class="description">
        <div class="ui sub header">Taken By:</div>
        <span v-if="task.takenBy.length === 0">Nobody</span>
        <span v-else>
          {{ task.takenBy.join(', ') }}
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
export default {
  props: {
    task: {
      required: true,
      type: Object
    }
  }
}
</script>
