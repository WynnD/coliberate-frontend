<template>
  <div class="ui card">
    <div class="content">
      <span class="header">Current Sprint</span>
    </div>

    <div class="content">
      <div class="ui segments">
        <div class="ui segment">
          <h4 class="ui header">Name: {{ currentSprint.name }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentSprint: {
        name: 'Sprint 1',
        startDate: new Date('2018-01-20'),
        endDate: new Date('2018-02-04'),
        stories: {},
        tasks: {}
      },
      sprints: {}
    }
  },
  computed: {
    formattedStartDate: () => this.formatDate(this.startDate),
    formattedEndDate: () => this.formatDate(this.endDate)
  },
  methods: {
    formatDate (date) {
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
