<template>
  <div class="content activity-list">
    <div class="ui small feed">
      <activity-item
        v-for="(activity, index) in activities"
        :key="index"
        :content="activity.description"
        :date="activity.date"
        :meta="getMeta(activity)"
      />
    </div>
  </div>
</template>

<script>
import ActivityItem from '@/components/Projects/ActivityItem'
import { mapGetters } from 'vuex'

export default {
  components: {
    'activity-item': ActivityItem
  },
  props: {
    activities: {
      type: Array,
      required: true,
      default: () => [{
        description: 'No activity for this project'
      }]
    }
  },
  mounted () {
    console.debug(this.activities)
  },
  methods: {
    getMeta (activity) {
      let message = ''
      if (activity.members) {
        const names = activity.members.map((id) => {
          const member = this.memberById()(id)
          console.debug(id, member)
          return member ? member.name : id
        })
        message += `<b>Involved:</b> ${names.join(', ')}`
      }
      return message
    },
    ...mapGetters(['memberById'])
  }
}
</script>

<style>
.activity-list .activity-item:not(:last-child) {
  border-bottom: 1px rgba(50,50,50,0.25) solid;
}
</style>
