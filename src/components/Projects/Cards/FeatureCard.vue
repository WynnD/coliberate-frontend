<template>
  <div class="ui card">
    <div class="content">
      <div class="header">Features</div>
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
                  {{ feature.stories.length }} stories
                </div>
                <div class="ui segment">
                  {{ feature.tasks.length }} tasks
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
/* global $ */
export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      progressBar: null
    }
  },
  mounted () {
    this.progressBar = $(this.$el).find('.extra .ui.progress').progress()
  },
  methods: {
    getProgressOfFeature (feature) {
      return Math.floor(Math.random() * 100)
    }
  }
}
</script>
