<template>
  <div id="sample-api-component">
    <button @click="getAPIData()">Click me to do a sample API call!</button>
    <div>{{ sampleData }}</div>
  </div>
</template>

<script>
/* global $ */
export default {
  data () {
    return {
      sampleData: 'API result will show up here'
    }
  },
  methods: {
    getAPIData () {
      this.sampleData = `Getting data. Please wait...`

      $.get('/data')
        .done(data => { this.sampleData = data })
        .fail(err => { this.sampleData = err })
    }
  }
}
</script>
