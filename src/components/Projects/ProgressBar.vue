<template>
  <div class="progress-bars">
    <div
      id="in-progress"
      class="ui yellow progress">
      <div class="bar">
        <div class="progress"/>
      </div>
    </div>
    <div
      id="done"
      class="ui green progress">
      <div class="bar finished">
        <div class="progress"/>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
export default {
  props: {
    doneCount: {
      required: false,
      type: Number,
      default: 0
    },
    inProgressCount: {
      required: false,
      type: Number,
      default: 0
    },
    totalCount: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      doneBar: null,
      inProgressBar: null
    }
  },
  computed: {
    donePercent () {
      if (this.doneCount < 1) {
        return 0
      }
      return (this.doneCount / this.totalCount) * 100
    },
    inProgressPercent () {
      if (this.doneCount < 1) {
        return 0
      }
      return (this.inProgressCount / this.totalCount) * 100
    }
  },
  watch: {
    doneCount () {
      this.updateProgress()
    },
    inProgressCount () {
      this.updateProgress()
    },
    totalCount () {
      this.updateProgress()
    }
  },
  mounted () {
    this.doneBar = $(this.$el).find('.ui.progress#done').progress()

    this.inProgressBar = $(this.$el).find('.ui.progress#in-progress').progress()

    setTimeout(() => {
      this.updateProgress()
    }, 100)
  },
  methods: {
    updateProgress () {
      this.doneBar.progress({
        percent: this.donePercent,
        showActivity: false,
        text: {
          percent: this.doneCount.toString()
        }
      })
      // add donePercent as bars are overlapping
      this.inProgressBar.progress({
        percent: (this.donePercent + this.inProgressPercent),
        text: {
          percent: this.inProgressCount.toString()
        }
      })
    }
  }
}
</script>

<style scoped>
.progress-bars {
  position: relative;
}

.progress-bars #done {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: transparent;
}

.progress-bars #in-progress {
  background: red;
  margin-bottom: 0.5rem;
}

.progress-bars .bar {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
