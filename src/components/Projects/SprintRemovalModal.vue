<template>
  <div class="ui modal form">
    <div class="header">Remove Sprint</div>
    <div class="scrolling content">
      {{ targetSprint }}
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui red button">
        Remove Sprint
      </button>
      <div class="ui grey cancel button">Cancel</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    releases: {
      required: true,
      type: Object
    },
    targetSprintId: {
      required: false,
      type: String,
      default: ''
    },
    sprints: {
      required: true,
      type: Object
    },
    stories: {
      required: true,
      type: Object
    },
    tasks: {
      required: true,
      type: Object
    }
  },
  computed: {
    targetSprint () {
      return this.sprints[this.targetSprintId]
    }
  }
}
</script>
