<template>
  <div class="ui card">
    <div class="content">
      <div class="header">Recent Activity</div>
      <div
        v-if="project.auditLog.length > 0"
        class="ui small feed">
        <activity-item
          v-for="(activity, index) in project.auditLog"
          :key="index"
          :activity-data="activity.description"
        />
      </div>
      <div
        v-else
        class="ui small feed">
        <activity-item :activity-data="'No activity for this project'"/>
      </div>
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
    project: {
      type: Object,
      required: true
    }
  }
}
</script>
