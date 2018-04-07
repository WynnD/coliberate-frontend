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
            <td>{{ value.name }}</td>
            <td>{{ value.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    members () {
      return Object.values(this.project.members).map(entry => {
        const member = this.memberById()(entry.id)
        return {
          name: member ? member.name : entry.id,
          ...entry
        }
      })
    }
  },
  methods: {
    ...mapGetters(['memberById'])
  }
}

</script>
