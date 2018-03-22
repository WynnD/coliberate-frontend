<template>
  <div
    id="release-selector"
    class="ui segments">
    <div class="ui segment inverted grey">
      <select
        v-model="currentReleaseId"
        class="ui dropdown">
        <option value="">Select a Release</option>
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
        <b>{{ isReleaseActive ? 'ACTIVE' : 'INACTIVE' }}</b>
      </span>
      <a class="ui right floated compact white inverted icon button">
        <i class="plus icon"/>
      </a>
    </div>
    <div
      v-if="currentRelease"
      class="ui segment">
      <div class="ui header medium">Overview</div>
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
    isCurrentReleaseActive () {
      return false
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
    }
  },
  watch: {
    currentReleaseId (newValue) {
      this.$emit('changerelease', newValue)
    }
  },
  mounted () {
    $(this.$el).find('.ui.dropdown').dropdown()
  }
}
</script>
