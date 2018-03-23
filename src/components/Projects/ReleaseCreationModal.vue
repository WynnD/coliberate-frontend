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
            <textarea v-model="release.description">
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
  data() {
    return {
      id: 'release',
      name: 'Release',
      description: 'Default release. :)',
      startDate: new Date(currentDate.valueOf() - oneWeek).toDateString(), // e.g. Mon Mar 12 2018
      endDate: new Date(new Date().valueOf() + 3 * oneWeek).toDateString(),
      features: [], // array of feature IDs
      sprints: [] // array of sprint IDs
    }
  },
  computed: {
    currentDate () {
      const date = new Date()
      let [year, month, day] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ]

      if (month < 10) {
        month = `0${month}`
      }

      if (day < 10) {
        day = `0${day}`
      }

      return `${year}-${month}-${day}`
    }
  }
}

</script>