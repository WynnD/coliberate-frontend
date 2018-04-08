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
          <div class="ui error message">
            <div class="header">Error</div>
            <p>An error has occurred</p>
          </div>
        </div>
        <!-- add sprints and features here -->
      </div>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui green button"
        @click="registerClickHandler">
        Add
      </button>
      <div class="ui cancel red button">Cancel</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

/* global $ */
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
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        features: [], // array of feature IDs
        sprints: [] // array of sprint IDs
      },
      $form: null
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
    },
    defaultRelease () {
      return {
        name: '',
        description: '',
        startDate: this.defaultStartDate,
        endDate: this.defaultEndDate,
        features: [], // array of feature IDs
        sprints: [] // array of sprint IDs
      }
    },
    ...mapGetters(['currentUser', 'isDevelopmentMode'])
  },
  mounted () {
    this.resetReleaseData()

    this.$form = $(this.$el)
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
    async registerClickHandler () {
      const releaseData = {
        // id: Math.ceil(Math.random() * 10000).toString().padStart(4, '0'),
        id: this.generateUniqueId()(this.project.releases, 'release-', 4),
        name: this.release.name.trim(),
        description: this.release.description.trim(),
        startDate: this.release.startDate,
        endDate: this.release.endDate,
        features: this.release.features,
        sprints: this.release.sprints
      }

      releaseData.name = releaseData.name || `release-${releaseData.id}`

      // eslint-disable-next-line
      console.debug("Sending register info:", releaseData)

      try {
        const result = await this.register(releaseData)
        console.debug(result)
        if (result === 'OK') {
          this.resetReleaseData()
          this.$form.modal('hide')
          this.$emit('update')
        } else {
          console.debug('Register failed!', result)
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
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
      this.$form.addClass('loading')
      const response = await this.sendRegisterData(data)
      // eslint-disable-next-line
      console.debug('register', { response })
      return response
    },
    sendRegisterData (releaseData) {
      const apiUrl = `api/projects/${this.project.id}/releases`
      const payload = {
        releaseData,
        memberID: this.currentUser.id,
        projectID: this.project.id
      }
      // console.debug({ payload, apiUrl })
      return new Promise((resolve, reject) => {
        const url = this.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/${apiUrl}`, payload)
          .done(resolve).fail(reject)
      })
    },
    notifyError (message = 'An error occurred while trying to register') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    resetReleaseData () {
      Object.keys(this.defaultRelease)
        .forEach(field => {
          this.release[field] = this.defaultRelease[field]
        })
    },
    ...mapGetters(['generateUniqueId'])
  }
}

</script>
