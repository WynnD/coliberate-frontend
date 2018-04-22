<template>
  <div id="app">
    <navbar/>
    <sidebar/>
    <div class="pusher">
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
    try {
      this.$store.commit('setDevelopmentMode', process.env.NODE_ENV === 'development')
      setTimeout(() => {
        console.debug('developmentMode', this.$store.getters.isDevelopmentMode)
      }, 1000)
    } catch (err) {}

    this.$store.getters.server.setStore(this.$store)
  },
  methods: {}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 5.5em;
}
</style>
