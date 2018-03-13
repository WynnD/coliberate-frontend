<template>
  <div class="ui card">
    <div class="content">
      <div class="header">Features</div>
    </div>

    <div class="content">
      <div class="ui divided items">
        <div class="item">
          <div class="content">
            <a class="header">Feature Name <i class="edit icon"/></a>

            <div class="description">Feature Description</div>

            <div class="extra">
              <div
                :data-percent="progress"
                class="ui progress">
                <div class="bar">
                  <div class="progress"/>
                </div>
                <div class="label">Completion Progress</div>
              </div>
            </div>

          </div>
        </div>
      </div>
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
  computed: {
    progress () {
      // computed as progress is defined by completion of stories and tasks
      return 37
    }
  },
  mounted () {
    this.progressBar = $(this.$el).find('.extra .ui.progress').progress()
  }
}
</script>
