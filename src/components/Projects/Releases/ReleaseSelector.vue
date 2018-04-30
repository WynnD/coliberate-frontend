<template>
  <div
    id="release-selector"
    class="ui segments">
    <div class="ui segment inverted grey">
      <select
        v-model="currentReleaseId"
        class="ui dropdown">
        <option value="">
          {{ numReleases > 0 ? 'Select a Release' : 'Add a Release' }}
        </option>
        <option
          v-for="release in sortedReleases"
          :key="release.id"
          :value="release.id">
          {{ getReleaseLabel(release) }}
        </option>
      </select>
      <span
        :class="{
          'ui left pointing label': true,
          blue: isCurrentReleaseActive
        }"
      >
        <b v-if="currentRelease">
          {{ isCurrentReleaseActive ? 'ACTIVE' : 'INACTIVE' }}
        </b>
        <b v-else>
          {{ numReleases }} {{ numReleases === 1 ? 'Release' : 'Releases' }} found
        </b>
      </span>
      <a
        @click="$emit('showmodal', 'release-create')"
        class="ui right floated compact white inverted icon button">
        <i class="plus icon"/>
        Add Release
      </a>
    </div>
    <div
      v-if="currentRelease"
      class="ui segment">
      <div class="ui header medium">
        <span>Overview</span>
        <div class="ui buttons right floated compact">
          <button
            @click.stop="releaseEditHandler(currentRelease.id)"
            class="ui inverted violet icon button">
            <i class="icon edit"/>
          </button>
          <button
            @click.stop="releaseRemoveHandler(currentRelease.id)"
            class="ui inverted red icon button">
            <i class="icon trash"/>
          </button>
        </div>
      </div>
      <div class="ui two column grid">
        <div class="column">
          <div>{{ currentRelease.description }}</div>
        </div>
        <div class="column">
          <p v-html="dateRangeMessage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/* global $ */
export default {
  props: {
    releases: {
      required: true,
      type: Object
    },
    initialRelease: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentReleaseId: ''
    }
  },
  computed: {
    ...mapGetters(['dateFunctions']),
    currentRelease () {
      return this.releases[this.currentReleaseId]
    },
    currentDate () {
      return new Date()
    },
    startDate () {
      if (this.currentRelease) {
        return new Date(this.currentRelease.startDate)
      }
      return this.currentDate
    },
    endDate () {
      if (this.currentRelease) {
        return new Date(this.currentRelease.endDate)
      }
      return this.currentDate
    },
    isCurrentReleaseActive () {
      return this.currentDate.valueOf() > this.startDate.valueOf() &&
        this.currentDate.valueOf() < this.endDate.valueOf()
    },
    numReleases () {
      if (!this.releases) {
        return 0
      }
      return Object.keys(this.releases).length
    },
    dateRangeMessage () {
      if (!this.currentRelease) {
        return ''
      }
      const dateRange = this.dateFunctions.getDateRange(this.startDate, this.endDate)
        // bold the dates
        .split(' to ').map(d => `<b>${d}</b>`).join(' to ')
      const dateDifference = this.dateFunctions.getDateDifferenceMessage(this.startDate, this.endDate)
      let relativeDifferenceMessage
      if (this.currentDate < this.startDate) {
        const relativeDifference = this.dateFunctions.getRelativeDateDifferenceMessage(this.startDate, ['millisecond', 'second'])
        relativeDifferenceMessage = `starts ${relativeDifference}`
      } else {
        const relativeDifference = this.dateFunctions.getRelativeDateDifferenceMessage(this.endDate, ['millisecond', 'second'])
        if (this.currentDate < this.endDate) {
          relativeDifferenceMessage = `ends ${relativeDifference}`
        } else {
          relativeDifferenceMessage = `ended ${relativeDifference}`
        }
      }
      return `${dateRange}<br>(${dateDifference} long, ${relativeDifferenceMessage})`
    },
    sortedReleases () {
      const result = Object.values(this.releases).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      console.debug(this.releases, result)
      return result
    }
  },
  watch: {
    currentReleaseId (newValue) {
      console.debug('currentReleaseID', newValue)
      this.$emit('changerelease', newValue)
    },
    initialRelease (newValue) {
      console.debug({newValue})
      $(this.$el).find('.ui.dropdown')
        .dropdown('set exactly', newValue)
      this.currentReleaseId = newValue
      console.debug('currentReleaseID', this.currentReleaseId)
    },
    releases (newValue) {
      const currentReleaseId = this.currentReleaseId
      console.debug('releases updated', currentReleaseId)
      $(this.$el).find('.ui.dropdown')
        .dropdown('set exactly', this.currentReleaseId)
      setTimeout(() => {
        this.currentReleaseId = newValue[currentReleaseId] ? currentReleaseId : ''
      }, 50)
    }
  },
  mounted () {
    $(this.$el).find('.ui.dropdown').dropdown()
  },
  methods: {
    releaseEditHandler (releaseId) {
      console.debug('Clicked edit for', releaseId)
    },
    releaseRemoveHandler (releaseId) {
      console.debug('Clicked remove for', releaseId)
      this.$emit('showmodal', `release-remove|${releaseId}`)
    },
    isReleaseActive (release) {
      const startDate = new Date(release.startDate)
      const endDate = new Date(release.endDate)
      return this.currentDate.valueOf() > startDate.valueOf() &&
        this.currentDate.valueOf() < endDate.valueOf()
    },
    getReleaseLabel (release) {
      return `${release.name || release.id}${this.isReleaseActive(release) ? ' (Active)' : ''}`
    }
  }
}
</script>
