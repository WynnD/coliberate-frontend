<template>
  <div class="activity-item">
    <div class="content">
      <div
        v-html="activityData"
        class="summary"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activityData: {
      type: String,
      required: true
    }
  }
}
</script>
