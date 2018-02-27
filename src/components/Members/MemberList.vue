<template>
  <div
    id="member list"
    class="ui container">
    <div
      v-if="$store.getters.isLoggedIn"
      class="ui centered cards">
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
            const userID = this.$store.state.accountData.id
            const members = response.data.filter(m => m.id !== userID)

            const memberObject = {}
            members.forEach(m => {
              memberObject[m.id.toString()] = m
            })
            console.debug('Got member data', memberObject)

            this.$store.commit('updateMemberData', memberObject)
            resolve()
          }).fail(reject)
      })
    }
  }
}
</script>
