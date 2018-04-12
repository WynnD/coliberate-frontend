<template>
  <div
    id="member list"
    class="ui container">
    <div
      v-if="$store.getters.isLoggedIn"
      class="ui centered cards">
      <member-card
        v-for="member in orderedMembers"
        :key="member.id"
        :account-data="member"/>
    </div>
  </div>
</template>

<script>
import MemberCard from '@/components/Members/MemberCard'
import { mapGetters } from 'vuex'
/* global $ */
export default {
  components: {
    'member-card': MemberCard
  },
  computed: {
    orderedMembers () {
      const otherMembers = Object.values(this.$store.state.members).filter(m => m.id !== this.currentUser.id)
      return [this.currentUser, ...otherMembers]
    },
    ...mapGetters(['isDevelopmentMode', 'currentUser'])
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

            const memberObject = {}
            members.forEach(m => {
              memberObject[m.id.toString()] = m

              if (m.id === this.currentUser.id) {
                console.debug('Updating current user data', {
                  old: this.currentUser,
                  new: m
                })
                this.$store.commit('login', m)
              }
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
