<template>
  <div
    id="team-card"
    class="ui card">
    <div
      id="header-container"
      class="content">
      <span class="header">Team</span>
    </div>

    <div class="content">
      <table class="ui compact table">
        <thead>
          <th>Name</th>
          <th>Role</th>
        </thead>
        <tbody>
          <tr
            v-for="(value,key) in members"
            :key="key">
            <td>{{ key }}</td>
            <td>{{ value.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
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
  }
}

</script>
