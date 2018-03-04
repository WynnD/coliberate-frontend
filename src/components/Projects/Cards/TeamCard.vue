<template>
  <div class="ui card">
    <div class="content">
      <span class="header">Team</span>
    </div>

    <div class="content">
      <table class="ui compact table">
        <thead>
          <th>Name</th>
          <th>Role</th>
        </thead>
        <tbody>
          <tr v-for="(value,key) in members"
          :key="key">
          <td>{{key}}</td>
          <td>{{value.role}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <activity-list :activities="project.activities"/>
  </div>
</template>

<script>
import ActivityList from '@/components/Projects/ActivityList'

export default {
  data () {
    return {
      members: {
        'Big Jeffrey': {
          role: 'Scrum Master'
        },
        'Little Wendy': {
          role: 'Scrum Master 2.0'
        }
      }
    }
  },
  components: {
    'activity-list': ActivityList
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}

</script>
