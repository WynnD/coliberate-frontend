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
      return ((this.doneCount / this.totalCount) * 100) || 0
    },
    inProgressPercent () {
      return ((this.inProgressCount / this.totalCount) * 100) || 0
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

    this.inProgressBar = $(this.$el).find('.ui.progress#in-progress').progress({
      autoSuccess: false
    })

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

      if (this.donePercent + this.inProgressPercent >= 95) {
        let successfulRemoves = 0
        const removeSuccess = () => {
          // console.debug('checking for success class')
          if (this.inProgressBar.hasClass('success')) {
            // console.debug('removing success class')
            this.inProgressBar.progress('set success', false)
            this.inProgressBar.removeClass('success')
            successfulRemoves = 0
          }

          if (successfulRemoves++ < 6) {
            setTimeout(removeSuccess, 100 * successfulRemoves)
          }
        }
        setTimeout(removeSuccess, 250)
      }
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
