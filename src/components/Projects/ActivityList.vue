<template>
  <div>
    <h4 class="ui sub header"><b>Activity</b></h4>
    <div class="ui small feed">
      <activity-item
        class="activity-item"
        v-for="activity in activities"
        :key="activity"
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
      required: true
    }
  }
}
