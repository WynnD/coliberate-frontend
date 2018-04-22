<template>
  <div class="ui stackable grid">
    <release-creation-modal
      @update="handleNewRelease"
      id="release-creation-modal"
      :features="project.features"
      :project="project"/>
    <feature-creation-modal
      id="feature-creation-modal"
      :stories="project.stories"
      :tasks="project.tasks"
      :features="project.features"
      :releases="project.releases"
      :initial-release="!isSandbox ? currentReleaseId : sandboxData.currentReleaseId"
      :project-id="project.id || ''"
      @update="handleNewFeature"
    />
    <sprint-creation-modal
      @update="handleNewSprint"
      id="sprint-creation-modal"
      :releases="project.releases"
      :initial-release="!isSandbox ? currentReleaseId : sandboxData.currentReleaseId"
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
      :initial-sprint="!isSandbox ? currentSprintId : sandboxData.currentSprintId"
      :initial-feature="!isSandbox ? currentFeatureId : sandboxData.currentFeatureId"
      :project-id="project.id || ''"
      @update="handleNewStory"
    />
    <task-creation-modal
      id="task-creation-modal"
      :stories="project.stories"
      :tasks="project.tasks"
      :features="project.features"
      :sprints="project.sprints"
      :project-members="project.members"
      :initial-sprint="!isSandbox ? currentSprintId : sandboxData.currentSprintId"
      :initial-feature="!isSandbox ? currentFeatureId : sandboxData.currentFeatureId"
      :initial-story="!isSandbox ? currentStoryId : sandboxData.currentStoryId"
      :project-id="project.id || ''"
      @update="handleNewTask"
    />
    <task-removal-modal
      id="task-removal-modal"
      :target-task-id="removeTargetId"
      :project="project"
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
        @changestory="handleStoryChange"
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
        @changestory="handleStoryChange"
        @changesprint="handleSprintChange"
      />
    </div>
    <div class="column sixteen wide">
      <backlog-viewer
        @showmodal="showSandboxModal"
        @changefeature="handleFeatureChange($event, true)"
        @changestory="handleStoryChange($event, true)"
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

import TaskCreationModal from '@/components/Projects/Tasks/TaskCreationModal'
import TaskRemovalModal from '@/components/Projects/Tasks/TaskRemovalModal'

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
    'story-creation-modal': StoryCreationModal,
    'task-creation-modal': TaskCreationModal,
    'task-removal-modal': TaskRemovalModal
  },
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      currentReleaseId: '',
      currentSprintId: '',
      currentFeatureId: '',
      removeTargetId: '',
      currentStoryId: '',
      isSandbox: false,
      sandboxData: {
        currentReleaseId: '',
        currentSprintId: '',
        currentFeatureId: '',
        currentStoryId: ''
      },
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

    this.modals['task-create'] = $(this.$el).find('#task-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')

    this.modals['task-remove'] = $(this.$el).find('#task-removal-modal')
      .modal('setting', 'closable', false)
      .modal('hide')
  },
  methods: {
    handleReleaseChange (releaseId, isSandbox = false) {
      console.debug({ releaseId, isSandbox })
      if (isSandbox) {
        this.sandboxData.currentReleaseId = releaseId
      }
      this.currentReleaseId = releaseId
    },
    handleSprintChange (sprintId, isSandbox = false) {
      console.debug({ sprintId, isSandbox })
      if (isSandbox) {
        this.sandboxData.currentSprintId = sprintId
      }
      this.currentSprintId = sprintId
    },
    handleFeatureChange (featureId, isSandbox = false) {
      console.debug({ featureId, isSandbox })
      if (isSandbox) {
        this.sandboxData.currentFeatureId = featureId
      }
      this.currentFeatureId = featureId
    },
    handleStoryChange (storyId, isSandbox = false) {
      console.debug({ storyId, isSandbox })
      if (isSandbox) {
        this.sandboxData.currentStoryId = storyId
      }
      this.currentStoryId = storyId
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
      this.sandboxData.currentSprintId = ''
      this.sandboxData.currentReleaseId = ''
      console.debug('handled new sprint')
    },
    handleNewFeature (releases = []) {
      if (!(releases.length === 0 || releases.indexOf(this.currentReleaseId) > -1)) {
        // set to first release in list
        this.currentReleaseId = releases[0]
      }
      this.$emit('update')
      console.debug('handled new feature')
    },
    handleNewStory () {
      this.$emit('update')
    },
    handleNewTask () {
      this.$emit('update')
    },
    showSandboxModal (type) {
      this.showModal(type, true)
    },
    showModal (type, isSandbox = false) {
      this.isSandbox = isSandbox
      console.debug({type, isSandbox}, this.modals[type])
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
