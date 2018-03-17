<template>
  <div
    id="feature-card"
    class="ui card">
    <creation-modal
      id="feature-creation-modal"
      :stories="project.stories"
      :tasks="project.tasks"
      :features="project.features"
    />
    <div class="content">
      <div class="header">
        <span>Features</span>
        <a
          @click="showModal"
          class="ui right floated animated fade compact button">
          <div class="hidden content">Add</div>
          <div class="visible content">
            <i class="plus icon"/>
          </div>
        </a>
      </div>
    </div>
    <div class="content">
      <div
        v-if="Object.keys(project.features).length > 0"
        class="ui divided items">
        <div
          v-for="feature in project.features"
          :key="feature.id"
          class="item">
          <div class="content">
            <a class="header">{{ feature.name }} <i class="edit icon"/></a>

            <div class="description">
              <span>{{ feature.description }}</span>
              <div class="ui horizontal segments">
                <div class="ui segment">
                  {{ feature.stories.length }} {{ feature.stories.length === 1 ? 'story' : 'stories' }}
                </div>
                <div class="ui segment">
                  {{ feature.tasks.length }} {{ feature.tasks.length === 1 ? 'task' : 'tasks' }}
                </div>
              </div>
            </div>

            <div class="extra">
              <div
                :data-percent="getProgressOfFeature(feature)"
                class="ui progress">
                <div class="bar">
                  <div class="progress"/>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div v-else>No features found. Add a feature by clicking the + in the top right of the card.</div>
    </div>
  </div>
</template>

<script>
import FeatureCreationModal from '@/components/Projects/FeatureCreationModal'
/* global $ */
export default {
  components: {
    'creation-modal': FeatureCreationModal
  },
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      progressBar: null,
      modal: null
    }
  },
  mounted () {
    this.progressBar = $(this.$el).find('.extra .ui.progress').progress()
    this.modal = $('#feature-card #feature-creation-modal')
      .modal('setting', 'closable', false)
      .modal('hide')
  },
  methods: {
    getProgressOfFeature (feature) {
      // TODO: dependent on progress of relates stories and features
      return Math.floor(Math.random() * 100)
    },
    showModal () {
      if (this.modal) {
        this.modal.modal('show')
      }
    }
  }
}
</script>
