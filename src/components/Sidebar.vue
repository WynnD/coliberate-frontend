<template>
  <div
    class="ui sidebar inverted vertical menu"
    id="sidebar">
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
      // eslint-disable-next-line
      console.log("Hiding sidebar")
      this.sidebar.sidebar('hide')
    }
  }
}
</script>
