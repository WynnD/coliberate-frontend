<template>
  <div class="ui stackable grid">
    <release-creation-modal
      id="release-creation-modal"
      :releases="project.releases"/>
    <feature-creation-modal
      id="feature-creation-modal"
      :stories="project.stories"
      :tasks="project.tasks"
      :features="project.features"
      :releases="project.releases"
      :initial-release="currentReleaseId"
    />
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
        @showmodal="showModal"
        :releases="project.releases"
        @changerelease="handleReleaseChange"/>
    </div>
    <div
      v-if="currentRelease"
      class="column sixteen wide">
      <feature-listing
        @showmodal="showModal"
        :release="currentRelease"
        :features="project.features"
        :stories="project.stories"
        :tasks="project.tasks"
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
import ReleaseCreationModal from '@/components/Projects/ReleaseCreationModal'
import ReleaseSelector from '@/components/Projects/ReleaseSelector'
import FeatureCreationModal from '@/components/Projects/FeatureCreationModal'
import FeatureListing from '@/components/Projects/FeatureListing'
import SprintCreationModal from '@/components/Projects/SprintCreationModal'
import SprintViewer from '@/components/Projects/SprintViewer'

/* global $ */
export default {
  components: {
    'release-creation-modal': ReleaseCreationModal,
    'release-selector': ReleaseSelector,
    'feature-creation-modal': FeatureCreationModal,
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
    this.modals['sprint-create'] = $(this.$el).find('#sprint-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')

    this.modals['feature-create'] = $(this.$el).find('#feature-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')

    this.modals['release-create'] = $(this.$el).find('#release-creation-modal')
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
