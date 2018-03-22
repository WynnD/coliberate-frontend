<template>
  <div class="ui stackable grid">
    <div class="column sixteen wide">
      <release-selector
        :releases="project.releases"
        @changerelease="handleReleaseChange"/>
    </div>
    {{ currentRelease }}
  </div>
</template>

<script>
import ReleaseSelector from '@/components/Projects/ReleaseSelector'

export default {
  components: {
    'release-selector': ReleaseSelector
  },
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      currentReleaseId: 'nothing'
    }
  },
  computed: {
    currentRelease () {
      return this.project.releases[this.currentReleaseId]
    }
  },
  methods: {
    handleReleaseChange (releaseId) {
      this.currentReleaseId = releaseId
    }
  }
}
</script>
