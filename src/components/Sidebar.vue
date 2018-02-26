<template>
  <div
    class="ui sidebar inverted vertical menu"
    id="sidebar">
    <div
      v-if="this.$store.getters.isLoggedIn"
      class="item">
      <img
        src="@/assets/logo.png"
        alt="Avatar"
        class="ui avatar image">
      <span class="right floated">
        {{ this.$store.state.accountData.name }}
      </span>
    </div>
    <router-link
      @click.native="hideSidebar"
      class="item"
      to="/">
      Overview
    </router-link>
    <router-link
      @click.native="hideSidebar"
      class="item"
      to="/projects">
      Projects
    </router-link>
    <router-link
      @click.native="hideSidebar"
      class="item"
      to="/members">
      Members
    </router-link>
    <router-link
      @click.native="hideSidebar"
      class="item"
      to="/settings">
      Settings
    </router-link>
    <router-link
      @click.native="logout"
      class="item"
      to="/login">
      <button class="ui basic fluid red button">
        Logout
      </button>
    </router-link>
  </div>
</template>

<script>
/* global $ */
export default {
  data () {
    return {
      sidebar: null
    }
  },
  mounted () {
    this.sidebar = $(this.$el)
    this.sidebar.sidebar({
      transition: 'overlay'
    })
  },
  methods: {
    hideSidebar () {
      this.sidebar.sidebar('hide')
    },
    logout () {
      this.$store.commit('logout')
      this.hideSidebar()
    }
  }
}
</script>
