<template>
  <div id="navbar-container">
    <div class="ui menu top fixed">
      <button
        class="ui button item big floated left"
        @click="toggleSidebar()">
        <i class="sidebar icon"/>
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
