<template>
  <div id="sample-api-component">
    <button @click="getAPIData()">Click me to do a sample API call!</button>
    <div>{{ sampleData }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sampleData: 'API result will show up here',
      clickCount: 0
    }
  },
  methods: {
    getAPIData () {
      this.clickCount++
      this.sampleData = `You clicked the button ${this.clickCount} time(s)! Now just hook up the API call.`
    }
  }
}
</script>
