<template>
  <remove-modal
    @update="$emit('update')"
    :api-url="apiUrl">
    <section slot="header">Remove Release Confirmation</section>
    <section slot="content">
      <div v-if="targetRelease">
        <h3>Are you sure you want to remove "{{ targetRelease.name }}"?</h3>
        <p>
          <b>Date Range: </b>
          <span>{{ dateRange }}</span>
          <span v-if="dateDifference">
            ({{ dateDifference }})
          </span>
        </p>

        <div v-if="releaseFeatures.length > 0 || releaseSprints.length > 0">
          <p>The following will be put into the backlog if they aren't associated with anything else.</p>
          <div v-if="releaseFeatures.length > 0">
            <h4>Features</h4>
            <feature-accordion-item
              v-for="feature in releaseFeatures"
              :key="`feature-${feature.id}`"
              :id="`feature-${feature.id}`"
              :feature="feature"
              :active-accordion="activeAccordion"
              @toggle-accordion-state="toggleAccordionState"
              :name="`feature-${feature.id}`"
              :stories="project.stories"
              :tasks="project.tasks"
              @click.native="refreshModal"
              :show-buttons="false"
            />
          </div>
          <div v-if="releaseSprints.length > 0">
            <h4>Sprints</h4>
            <sprint-accordion-item
              v-for="sprint in releaseSprints"
              :key="`sprint-${sprint.id}`"
              :id="`sprint-${sprint.id}`"
              :sprint="sprint"
              :active-accordion="activeAccordion"
              @toggle-accordion-state="toggleAccordionState"
              :name="`sprint-${sprint.id}`"
              :stories="project.stories"
              :tasks="project.tasks"
              @click.native="refreshModal"
              :show-buttons="false"
            />
          </div>
        </div>
        <div v-else>
          No associated features or sprints found with this release.
        </div>
      </div>
    </section>
  </remove-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'
import SprintAccordionItem from '@/components/Projects/Sprints/SprintAccordionItem'
import RemoveModal from '@/components/RemoveModal'

/* global $ */
export default {
  components: {
    'feature-accordion-item': FeatureAccordionItem,
    'sprint-accordion-item': SprintAccordionItem,
    'remove-modal': RemoveModal
  },
  props: {
    targetReleaseId: {
      required: false,
      type: String,
      default: ''
    },
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      $form: null,
      activeAccordion: ''
    }
  },
  computed: {
    targetRelease () {
      return this.project.releases[this.targetReleaseId]
    },
    releaseFeatures () {
      return this.targetRelease.features
        .map(id => this.project.features[id])
    },
    releaseSprints () {
      return this.targetRelease.sprints
        .map(id => this.project.sprints[id])
    },
    dateRange () {
      if (this.targetSprint) {
        return this.dateFunctions().getDateRange(this.targetRelease.startDate, this.targetRelease.endDate)
      }
      return this.dateFunctions().getDateRange()
    },
    dateDifference () {
      if (!this.targetRelease) {
        return this.dateFunctions().getDateDifferenceMessage(new Date(), new Date())
      }
      const startDate = new Date(this.targetRelease.startDate)
      const endDate = new Date(this.targetRelease.endDate)
      const currentDate = new Date()
      const difference = this.dateFunctions().getDateDifferenceMessage(startDate, endDate)
      let relativeDifferenceMessage
      if (currentDate < startDate) {
        const relativeDifference = this.dateFunctions().getRelativeDateDifferenceMessage(startDate, ['millisecond', 'second'])
        relativeDifferenceMessage = `starts ${relativeDifference}`
      } else {
        const relativeDifference = this.dateFunctions().getRelativeDateDifferenceMessage(endDate, ['millisecond', 'second'])
        if (currentDate < endDate) {
          relativeDifferenceMessage = `ends ${relativeDifference}`
        } else {
          relativeDifferenceMessage = `ended ${relativeDifference}`
        }
      }
      return `${difference} long, ${relativeDifferenceMessage}`
    },
    apiUrl () {
      return `api/projects/${this.project.id}/releases/${this.targetReleaseId}?member_id=${this.currentUser.id}`
    },
    ...mapGetters(['currentUser'])
  },
  watch: {
    targetReleaseId () {
      this.activeAccordion = ''
      this.$form.removeClass('error')
      this.refreshModal()
    }
  },
  mounted () {
    this.$form = $(this.$el)
  },
  methods: {
    ...mapGetters(['dateFunctions']),
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
      this.activeSubAccordion = ''
    },
    refreshModal () {
      setTimeout(() => {
        this.$form.modal('refresh')
      }, 50)
    }
  }
}
</script>
