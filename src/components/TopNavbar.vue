<template>
  <div id="navbar-container">
    <div class="ui menu top fixed">
      <button
        @click="toggleSidebar()"
        class="ui button item floated left">
        <i class="sidebar icon"></i>
      </button>
    </div>
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
    this.sidebar = $('#sidebar')
    this.sidebar.sidebar({
      transition: 'overlay'
    })
  },
  methods: {
    toggleSidebar () {
      this.sidebar.sidebar('toggle')
    }
  }
}
</script>
