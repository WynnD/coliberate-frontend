<template>
  <div class="card">
    <div class="content">
      <img
        class="right floated mini ui image"
        src="@/assets/logo.png">
      <div class="header">
        {{ accountData.name }}
      </div>
      <div class="meta">
        {{ accountData.email }}
      </div>
    </div>
    <div class="extra content">
      <router-link
        :to="routerLink"
        class="ui button fluid">
        View Profile
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accountData: {
      type: Object,
      required: true
    }
  },
  computed: {
    routerLink () {
      return `/members/${this.accountData.id}`
    }
  }
}
</script>
