<template>
  <div
    id="app"
    class="pusher">
    <sidebar/>
    <navbar/>
    <ul id="link-list">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/samplePage">API Test Page</router-link></li>
    </ul>
    <router-view/>
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
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2.95em;
}
</style>
