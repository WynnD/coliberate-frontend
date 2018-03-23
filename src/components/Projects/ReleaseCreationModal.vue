<template>
  <div class="ui modal form">
    <div class="header">Add a Release</div>
    <div class="content">
      <div class="ui segments">
        <div class="ui segment">
          <div class="field">
            <label>Release Name</label>
            <input
              v-model="release.name"
              type="text"
            >
          </div>
          <div class="field">
            <label>Description</label>
            <textarea v-model="release.description"/>
          </div>
        </div>
        <div class="ui segment">
          <div class="field">
            <label>Start Date</label>
            <input
              v-model="release.startDate"
              type="date">
          </div>
          <div class="field">
            <label>End Date</label>
            <input
              v-model="release.endDate"
              type="date">
          </div>
        </div>
        <!-- add sprints and features here -->
      </div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui green button"
        @click="registerHandler">
        Add
      </button>
      <div class="ui cancel red button">Cancel</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    releases: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      release: {
        id: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        features: [], // array of feature IDs
        sprints: [] // array of sprint IDs
      }
    }
  },
  computed: {
    defaultStartDate () {
      const date = new Date()
      return this.getFormattedDate(date)
    },
    defaultEndDate () {
      const oneDay = 24 * 60 * 60 * 1000
      const oneWeek = 7 * oneDay
      // TODO: change to use project's default sprint length value
      const date = new Date(new Date().valueOf() + 2 * oneWeek)
      return this.getFormattedDate(date)
    }
  },
  mounted () {
    // TODO: better way to generate id
    this.release.id = this.generateRandomId()

    this.release.startDate = this.defaultStartDate
    this.release.endDate = this.defaultEndDate
  },
  methods: {
    getFormattedDate (date) {
      let [year, month, day] = [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        (date.getDate()).toString().padStart(2, '0')
      ]

      return `${year}-${month}-${day}`
    },
    generateRandomId () {
      const createID = (prefix, number) => `${prefix}${number.toString().padStart(4, '0')}`
      const prefix = 'sprint-'
      let numberId = Math.floor(Math.random() * 1000)
      let numIterations = 0
      while (this.releases[createID(prefix, numberId)] && numIterations < 1000) {
        numberId = Math.floor(Math.random() * 1000)
        numIterations++
      }

      return createID(prefix, numberId)
    },
    async registerHandler () {
      console.debug(this.release)
    }
  }
}

</script>
