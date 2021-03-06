<template>
  <div class="ui stackable grid">
    <release-creation-modal
      @update="handleNewRelease"
      id="release-creation-modal"
      :features="project.features"
      :project="project"/>
    <release-removal-modal
      id="release-removal-modal"
      :target-release-id="removeTargetId"
      :project="project"
      @update="$emit('update')"
    />
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
    <feature-removal-modal
      id="feature-removal-modal"
      :target-feature-id="removeTargetId"
      :project="project"
      @update="$emit('update')"
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
      :target-sprint-id="removeTargetId"
      :project="project"
      @update="$emit('update')"
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
    <story-removal-modal
      id="story-removal-modal"
      :target-story-id="removeTargetId"
      :project="project"
      @update="$emit('update')"
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
      @update="$emit('update')"
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
        :project-id="project.id"
        @update="$emit('update')"
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
        :project-id="project.id"
        @update="$emit('update')"
        @changestory="handleStoryChange"
        @changesprint="handleSprintChange"
      />
    </div>
    <div class="column sixteen wide">
      <backlog-viewer
        @showmodal="showSandboxModal"
        @update="$emit('update')"
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
import ReleaseRemovalModal from '@/components/Projects/Releases/ReleaseRemovalModal'

import FeatureCreationModal from '@/components/Projects/Features/FeatureCreationModal'
import FeatureListing from '@/components/Projects/Features/FeatureListing'
import FeatureRemovalModal from '@/components/Projects/Features/FeatureRemovalModal'

import SprintCreationModal from '@/components/Projects/Sprints/SprintCreationModal'
import SprintViewer from '@/components/Projects/Sprints/SprintViewer'
import SprintRemovalModal from '@/components/Projects/Sprints/SprintRemovalModal'

import StoryCreationModal from '@/components/Projects/Stories/StoryCreationModal'
import StoryRemovalModal from '@/components/Projects/Stories/StoryRemovalModal'

import TaskCreationModal from '@/components/Projects/Tasks/TaskCreationModal'
import TaskRemovalModal from '@/components/Projects/Tasks/TaskRemovalModal'

/* global $ */
export default {
  components: {
    'backlog-viewer': BacklogViewer,
    'release-creation-modal': ReleaseCreationModal,
    'release-selector': ReleaseSelector,
    'release-removal-modal': ReleaseRemovalModal,
    'feature-creation-modal': FeatureCreationModal,
    'feature-listing': FeatureListing,
    'feature-removal-modal': FeatureRemovalModal,
    'sprint-creation-modal': SprintCreationModal,
    'sprint-viewer': SprintViewer,
    'sprint-removal-modal': SprintRemovalModal,
    'story-creation-modal': StoryCreationModal,
    'story-removal-modal': StoryRemovalModal,
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
    const modalMapping = {
      'release-create': '#release-creation-modal',
      'release-remove': '#release-removal-modal',
      'feature-create': '#feature-creation-modal',
      'feature-remove': '#feature-removal-modal',
      'sprint-create': '#sprint-creation-modal',
      'sprint-remove': '#sprint-removal-modal',
      'story-create': '#story-creation-modal',
      'story-remove': '#story-removal-modal',
      'task-create': '#task-creation-modal',
      'task-remove': '#task-removal-modal'
    }

    Object.keys(modalMapping)
      .forEach(modalType => {
        this.modals[modalType] = $(this.$el).find(modalMapping[modalType])
          .modal({
            closable: false,
            onVisible () {
              $(this).modal('refresh')
            }
          }).modal('hide')
      })
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
