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
    project: {
      type: Object,
      required: true
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
      // set to two sprint lengths after current start date
      const date = new Date(new Date(this.defaultStartDate).valueOf() + this.project.defaultSprintLength * 2 * oneDay)
      return this.getFormattedDate(date)
    }
  },
  mounted () {
    // TODO: better way to generate id
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
    async registerHandler () {
      const data = {
        name: this.release.id.trim(),
        description: this.release.description.trim(),
        startDate: this.release.startDate,
        endDate: this.release.endDate,
        features: this.release.features,
        sprints: this.release.sprints
      }

      // eslint-disable-next-line
      console.debug("Sending register info:", data)

      try {
        const result = await this.register(data)

        if (result.status !== 200) {
          // eslint-disable-next-line
          console.debug("Register failed!", result);
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        } else {
          this.$form.modal('hide')
          this.$router.push({ path: `/releases/${projectData.id}` })
        }
      } catch (err) {
        // eslint-disable-next-line
        console.debug("Register failed!", err);
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }
      this.$form.removeClass('loading')
    },
    
    async register (data = {}) {
      const textFields = ['name', 'description', 'startDate', 'endDate']
      let errorMessage
      console.debug('checking release data', { data })
      textFields.forEach(f => {
        if (!errorMessage && (!data[f] || data[f].toString().trim().length === 0)) {
          errorMessage = { responseJSON: { error: `${f} field is empty` } }
        }
      })

      if (errorMessage) {
        return errorMessage
      }

      this.$form.addClass('loading')
      const response = await this.sendRegisterData(data)
      // eslint-disable-next-line
      console.debug('register', { data })
      return data
    },
    sendRegisterData (data) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/api/releases`, { data })
          .done(resolve).fail(reject)
      })
    },
  }
}

</script>
