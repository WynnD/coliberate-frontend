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
      :project-id="project.id || ''"
      @update="handleNewFeature"
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
    <story-creation-modal
      id="story-creation-modal"
      :stories="project.stories"
      :tasks="project.tasks"
      :features="project.features"
      :sprints="project.sprints"
      :initial-sprint="currentSprintId"
      :initial-feature="currentFeatureId"
      :project-id="project.id || ''"
      @update="handleNewStory"
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
        @changefeature="handleFeatureChange"
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
        @changesprint="handleSprintChange"
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
import ReleaseCreationModal from '@/components/Projects/Releases/ReleaseCreationModal'
import ReleaseSelector from '@/components/Projects/Releases/ReleaseSelector'
import FeatureCreationModal from '@/components/Projects/Features/FeatureCreationModal'
import FeatureListing from '@/components/Projects/Features/FeatureListing'
import SprintCreationModal from '@/components/Projects/Sprints/SprintCreationModal'
import SprintViewer from '@/components/Projects/Sprints/SprintViewer'
import SprintRemovalModal from '@/components/Projects/Sprints/SprintRemovalModal'
import StoryCreationModal from '@/components/Projects/Stories/StoryCreationModal'

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
    'sprint-removal-modal': SprintRemovalModal,
    'story-creation-modal': StoryCreationModal
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
      currentFeatureId: 'nothing',
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

    this.modals['story-create'] = $(this.$el).find('#story-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')
  },
  methods: {
    handleReleaseChange (releaseId) {
      console.debug({ releaseId })
      this.currentReleaseId = releaseId
    },
    handleSprintChange (sprintId) {
      console.debug({ sprintId })
      this.currentSprintId = sprintId
    },
    handleFeatureChange (featureId) {
      console.debug({ featureId })
      this.currentFeatureId = featureId
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
    handleNewFeature (releases = []) {
      // don't need to do anything
      if (releases.length === 0 || releases.indexOf(this.currentReleaseId) > -1) {
        return
      }

      // set to first release in list
      this.currentReleaseId = releases[0]
      this.$emit('update')
      console.debug('handled new feature')
    },
    handleNewStory () {
      this.$emit('update')
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
