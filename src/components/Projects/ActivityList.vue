<template>
  <div class="content">
    <span class="ui sub header">Recent Activity</span>
    <div class="ui small feed">
      <activity-item
        v-for="activity in activities"
        :key="activity"
        :activity-data="activity"
        class="activity-item"
      />
    </div>
  </div>
</template>

<script>
import ActivityItem from '@/components/Projects/ActivityItem'

export default {
  components: {
    'activity-item': ActivityItem
  },
  props: {
    activities: {
      type: Array,
      required: true,
      default: () => ['No activity for this project']
    }
  },
  mounted () {
    console.debug(this.activities)
  }
}
</script>
