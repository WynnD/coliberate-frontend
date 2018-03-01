<template>
  <div
    id="sidebar"
    class="ui sidebar inverted vertical menu">
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
      to="/"
      class="item"
      @click.native="hideSidebar">
      Overview
    </router-link>
    <router-link
      to="/projects"
      class="item"
      @click.native="hideSidebar">
      Projects
    </router-link>
    <router-link
      to="/members"
      class="item"
      @click.native="hideSidebar">
      Members
    </router-link>
    <router-link
      to="/settings"
      class="item"
      @click.native="hideSidebar">
      Settings
    </router-link>
    <router-link
      to="/login"
      class="item"
      @click.native="logout">
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
