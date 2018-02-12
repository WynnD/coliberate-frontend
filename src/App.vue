<template>
  <div id="app">
    <img src="./assets/logo.png">
    <ul id="link-list">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/samplePage">API Test Page</router-link></li>
    </ul>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
