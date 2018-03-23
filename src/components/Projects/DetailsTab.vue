<template>
  <div class="ui stackable grid">
    <sprint-creation-modal
      id="sprint-creation-modal"
      :releases="project.releases"
      :initial-release="currentReleaseId"
      :sprints="project.sprints"
      :stories="project.stories"
      :tasks="project.tasks"
    />
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
        @showmodal="showModal"
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
import SprintCreationModal from '@/components/Projects/SprintCreationModal'
import SprintViewer from '@/components/Projects/SprintViewer'

/* global $ */
export default {
  components: {
    'release-selector': ReleaseSelector,
    'feature-listing': FeatureListing,
    'sprint-creation-modal': SprintCreationModal,
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
      currentReleaseId: 'nothing',
      modals: {}
    }
  },
  computed: {
    currentRelease () {
      return this.project.releases[this.currentReleaseId]
    }
  },
  mounted () {
    this.modals.sprint = $('#project-page #sprint-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')
  },
  methods: {
    handleReleaseChange (releaseId) {
      this.currentReleaseId = releaseId
    },
    showModal (type) {
      console.debug({type}, this.modals[type])
      if (this.modals[type]) {
        this.modals[type].modal('show')
      }
    }
  }
}
</script>
