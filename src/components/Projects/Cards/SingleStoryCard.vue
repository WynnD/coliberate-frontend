<template>
  <div class="ui fluid card">
    <div class="content">
      <div class="header">{{ story.name }} ({{ story.businessValue }} points)</div>
      <div class="meta">
        <b>Status:</b> {{ story.status }}
        |
        {{ story.tasks.length }}
        {{ story.tasks.length === 1 ? 'task' : 'tasks' }}
      </div>
      <div class="description">
        {{ story.description }}
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
  }
}
</script>
