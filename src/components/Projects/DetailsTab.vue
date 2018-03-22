<template>
  <div class="ui stackable grid">
    <div class="column sixteen wide">
      <release-selector
        :releases="project.releases"
        @changerelease="handleReleaseChange"/>
    </div>
    <div
      v-if="currentRelease"
      class="column sixteen wide">
      <feature-listing
        :release="currentRelease"
        :features="project.features"
      />
    </div>
    <div
      v-if="currentRelease"
      class="column sixteen wide">
      <sprint-viewer
        :release="currentRelease"
        :sprints="project.sprints"
        :stories="project.stories"
        :tasks="project.tasks"
      />
    </div>
  </div>
</template>

<script>
import ReleaseSelector from '@/components/Projects/ReleaseSelector'
import FeatureListing from '@/components/Projects/FeatureListing'
import SprintViewer from '@/components/Projects/SprintViewer'

export default {
  components: {
    'release-selector': ReleaseSelector,
    'feature-listing': FeatureListing,
    'sprint-viewer': SprintViewer
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
