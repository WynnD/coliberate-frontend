<template>
  <div
    id="member list"
    class="ui container">
    <div
      v-if="$store.getters.isLoggedIn"
      class="ui cards">
      <member-card :account-data="$store.state.accountData"/>
      <member-card
        v-for="member in $store.state.memberData"
        :key="member.id"
        :account-data="member"/>
    </div>
  </div>
</template>

<script>
import MemberCard from '@/components/Members/MemberCard'

/* global $ */
export default {
  components: {
    'member-card': MemberCard
  },
  mounted () {
    this.getMembers()
  },
  methods: {
    getMembers () {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.get(`${url}/api/members`)
          .done(response => {
            const members = response.data
            console.debug('Got member data', members)
            const userID = this.$store.state.accountData.id
            this.$store.commit('updateMemberData', members.filter(m => m.id !== userID))
            resolve()
          }).fail(reject)
      })
    }
  }
}
</script>
