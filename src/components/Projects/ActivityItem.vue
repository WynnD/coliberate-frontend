<template>
  <div class="activity-item">
    <div class="content">
      <div class="summary">
        {{ activityData }}
      </div>
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
