<template>
  <div
    id="single-story-card"
    class="ui fluid card">
    <div class="content">
      <div class="header">{{ story.name }}</div>
      <div class="header">
        <div :class="ribbonClass">{{ story.status.toUpperCase() }}</div>
        <span class="left floated">
          ({{ story.businessValue }} points)
        </span>
      </div>
      <div class="meta">
        <b>Total Tasks:</b> {{ story.tasks.length }}
      </div>
      <div class="description">
        <p><b>Description:</b></p>
        <p>
          {{ story.description }}
        </p>
      </div>
    </div>
    <div class="extra content">
      <slot>
        Maybe add a progress bar here?
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    story: {
      required: true,
      type: Object
    }
  },
  computed: {
    ribbonClass () {
      const status = this.story.status.toLowerCase()
      return {
        'ui right ribbon label': true,
        red: status === 'todo',
        yellow: status === 'in-progress',
        green: status === 'done'
      }
    }
  }
}
</script>

<style>
#single-story-card .header .left.floated {
  margin-right: -20rem;
}
</style>
