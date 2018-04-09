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
          v-for="release in releases"
          :key="release.id"
          :value="release.id">
          {{ release.name }}
        </option>
      </select>
      <span
        :class="{
          'ui left pointing label': true,
          blue: isReleaseActive
        }"
      >
        <b v-if="currentRelease">
          {{ isReleaseActive ? 'ACTIVE' : 'INACTIVE' }}
        </b>
        <b v-else>
          {{ numReleases }} {{ numReleases === 1 ? 'Release' : 'Releases' }} found
        </b>
      </span>
      <a
        @click="$emit('showmodal', 'release-create')"
        class="ui right floated compact white inverted icon button">
        <i class="plus icon"/>
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
          <div>
            <b>{{ currentRelease.startDate }}</b> to <b>{{ currentRelease.endDate }}</b>
          </div>
          Release Level overview charts here
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    isReleaseActive () {
      return this.currentDate.valueOf() > this.startDate.valueOf() &&
        this.currentDate.valueOf() < this.endDate.valueOf()
    },
    numReleases () {
      if (!this.releases) {
        return 0
      }
      return Object.keys(this.releases).length
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
    releases () {
      const currentReleaseId = this.currentReleaseId
      console.debug('releases updated', currentReleaseId)
      $(this.$el).find('.ui.dropdown')
        .dropdown('set exactly', this.currentReleaseId)
      setTimeout(() => {
        this.currentReleaseId = currentReleaseId
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
    }
  }
}
</script>
