<template>
  <div
    v-if="member.name"
    class="center aligned row">
    <div class="three wide column">
      {{ member.name }}
    </div>
    <div class="two wide column">
      {{ interestedSkills.join(', ') }}
    </div>
    <div class="two wide column">
      {{ experienceSkills.join(', ') }}
    </div>
    <div
      id="role-selector"
      class="nine wide column">
      <div class="ui compact buttons">
        <button
          v-for="(role, index) in allRoles"
          :key="index"
          :class="getButtonClass(role)"
          @click="toggleRole(role)"
        >
          {{ role }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const defaultObject = {}
export default {
  props: {
    member: {
      required: false,
      type: Object,
      default: defaultObject
    }
  },
  data () {
    return {
      roles: ['Scrum Master']
    }
  },
  computed: {
    allRoles: () => ['Scrum Master', 'Product Owner', 'Development Team'],
    experienceMap: () => ['None', 'Low', 'High'],
    interestedSkills () {
      return this.member.skills.filter(s => s.interested).map(s => s.name)
    },
    experienceSkills () {
      return this.member.skills
        .filter(s => s.experience > 0)
        .sort((a, b) => b.experience - a.experience)
        .map(s => `${s.name} (${this.experienceMap[s.experience]})`)
    }
  },
  watch: {
    roles (newValue) {
      this.$emit('rolechange', { id: this.member.id, roles: newValue })
    }
  },
  mounted () {
    this.$emit('rolechange', { id: this.member.id, roles: this.roles })
  },
  methods: {
    isRoleActive (role) {
      return this.roles.indexOf(role) > -1
    },
    getButtonClass (role) {
      return {
        'ui button toggle': true,
        'active': this.isRoleActive(role)
      }
    },
    toggleRole (role) {
      if (this.isRoleActive(role)) {
        this.roles = this.roles.filter(name => name !== role)
      } else {
        this.roles.push(role)
      }
    }
  }
}
</script>

<style scoped>
#role-selector.wide.column {
  overflow-x: auto;
}
</style>
