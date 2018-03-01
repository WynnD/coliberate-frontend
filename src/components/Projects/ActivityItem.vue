<template>
  <div class="activity-item">
    <div class="content">
      <div
        class="summary"
        v-html="activityData"
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
