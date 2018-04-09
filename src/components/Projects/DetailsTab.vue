<template>
  <div class="ui stackable grid">
    <release-creation-modal
      @update="handleNewRelease"
      id="release-creation-modal"
      :project="project"/>
    <feature-creation-modal
      id="feature-creation-modal"
      :stories="project.stories"
      :tasks="project.tasks"
      :features="project.features"
      :releases="project.releases"
      :initial-release="currentReleaseId"
    />
    <sprint-creation-modal
      @update="handleNewSprint"
      id="sprint-creation-modal"
      :releases="project.releases"
      :initial-release="currentReleaseId"
      :sprints="project.sprints"
      :stories="project.stories"
      :tasks="project.tasks"
      :project-id="project.id || ''"
    />
    <sprint-removal-modal
      id="sprint-removal-modal"
      :releases="project.releases"
      :target-sprint-id="removeTargetId"
      :sprints="project.sprints"
      :stories="project.stories"
      :tasks="project.tasks"
    />

    <div class="column sixteen wide">
      <release-selector
        @showmodal="showModal"
        :releases="project.releases"
        :initial-release="currentReleaseId"
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
        :initial-sprint="currentSprintId"
      />
    </div>
    <div class="column sixteen wide">
      <backlog-viewer
        @showmodal="showModal"
        :project="project"/>
    </div>
  </div>
</template>

<script>
import BacklogViewer from '@/components/Projects/BacklogViewer'
import ReleaseCreationModal from '@/components/Projects/ReleaseCreationModal'
import ReleaseSelector from '@/components/Projects/ReleaseSelector'
import FeatureCreationModal from '@/components/Projects/FeatureCreationModal'
import FeatureListing from '@/components/Projects/FeatureListing'
import SprintCreationModal from '@/components/Projects/SprintCreationModal'
import SprintViewer from '@/components/Projects/SprintViewer'
import SprintRemovalModal from '@/components/Projects/SprintRemovalModal'

/* global $ */
export default {
  components: {
    'backlog-viewer': BacklogViewer,
    'release-creation-modal': ReleaseCreationModal,
    'release-selector': ReleaseSelector,
    'feature-creation-modal': FeatureCreationModal,
    'feature-listing': FeatureListing,
    'sprint-creation-modal': SprintCreationModal,
    'sprint-viewer': SprintViewer,
    'sprint-removal-modal': SprintRemovalModal
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
      currentSprintId: 'nothing',
      removeTargetId: 'nothing',
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

    this.modals['sprint-remove'] = $(this.$el).find('#sprint-removal-modal')
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
      console.debug({ releaseId })
      this.currentReleaseId = releaseId
    },
    handleNewRelease (newRelease) {
      this.currentReleaseId = newRelease || ''
      this.$emit('update')
      console.debug('handled new release')
    },
    handleNewSprint (updateData) {
      const { sprint, release } = updateData
      console.debug(sprint, release)
      this.currentSprintId = ''
      this.currentReleaseId = release || ''
      setTimeout(() => {
        this.currentSprintId = sprint || ''
      }, 50)
      this.$emit('update')
      console.debug('handled new sprint')
    },
    showModal (type) {
      console.debug({type}, this.modals[type])
      const isRemoveCommand = type.indexOf('remove') > -1 && type.indexOf('|') > -1
      if (this.modals[type] && !isRemoveCommand) {
        this.modals[type].modal('show')
      } else if (isRemoveCommand) {
        const [modalType, target] = type.split('|')
        this.removeTargetId = target
        if (this.modals[modalType]) {
          this.modals[modalType].modal('show')
        }
      }
    }
  }
}
</script>
