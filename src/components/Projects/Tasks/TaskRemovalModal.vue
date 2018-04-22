<template>
  <div class="ui modal form">
    <div class="header">Remove Task Confirmation</div>
    <div
      v-if="targetTask"
      class="scrolling content">
      <h3>Are you sure you want to remove "{{ targetTask.name }}"?</h3>
      <div v-if="hasAssociations">
        <p>The following items will have the task removed from their respective task list.</p>
        <div>
          <h4>Features</h4>
          {{ associatedFeatures }}
        </div>
        <div>
          <h4>Sprints</h4>
          {{ associatedSprints }}
        </div>
        <div>
          <h4>Stories</h4>
          {{ associatedStories }}
        </div>
      </div>
      <div v-else>This task is not associated with any feature, sprint, or story.</div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui red button">
        Remove Task
      </button>
      <div class="ui grey cancel button">Cancel</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    targetTaskId: {
      required: false,
      type: String,
      default: ''
    },
    project: {
      required: true,
      type: Object
    }
  },
  computed: {
    targetTask () {
      return this.project.tasks[this.targetTaskId]
    },
    associatedFeatures () {
      return Object.values(this.project.features)
        .filter(f => f.tasks.includes(this.targetTaskId))
    },
    associatedSprints () {
      return Object.values(this.project.sprints)
        .filter(s => s.tasks.includes(this.targetTaskId))
    },
    associatedStories () {
      return Object.values(this.project.stories)
        .filter(s => s.tasks.includes(this.targetTaskId))
    },
    hasAssociations () {
      return this.associatedFeatures.length > 0 ||
        this.associatedSprints.length > 0 ||
        this.associatedStories.length > 0
    }
  }
}
</script>
