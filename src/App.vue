<template>
  <div class="wrapper">
    <sidebar/>
    <navbar/>
    <div
      id="app"
      class="pusher">
      <router-view/>
    </div>
  </div>
</template>

<script>
import TopNavbar from '@/components/TopNavbar'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'App',
  components: {
    'navbar': TopNavbar,
    'sidebar': Sidebar
  },
  data () {
    return {}
  },
  mounted () {

  },
  methods: {}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2.85em;
}
</style>
