<template>
  <div
    @click="refreshModal"
    class="ui modal form">
    <div class="header">
      <slot name="header">Remove Confirmation</slot>
    </div>
    <div class="scrolling content">
      <slot name="content">
        <h3>Are you sure you want to remove this?</h3>
        <div>Relevant information about affected items from deleting target would be shown here.</div>
      </slot>
      <slot name="error">
        <div class="ui error message">
          <div class="header">Error</div>
          <p>An error has occurred</p>
        </div>
      </slot>
    </div>
    <div class="actions">
      <button
        type="submit"
        class="ui red button">
        Remove
      </button>
      <div class="ui grey cancel button">Cancel</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

/* global $ */
export default {
  props: {
    apiUrl: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      isLoading: false,
      $form: null
    }
  },
  watch: {
    isLoading (newValue) {
      if (newValue) {
        this.$form.addClass('loading')
      } else {
        this.$form.removeClass('loading')
      }
    }
  },
  mounted () {
    this.$form = $(this.$el)
    this.$form.submit((e) => {
      e.preventDefault()
      this.requestHandler()
    })

    this.$form.find('.actions .ui.red.button')
      .on('click', (e) => {
        e.preventDefault()
        this.requestHandler()
      })
  },
  methods: {
    ...mapGetters(['server']),
    async requestHandler () {
      console.debug('sending request to delete using url', this.apiUrl)
      this.isLoading = true
      try {
        const result = await this.server().deleteFromServer(this.apiUrl)
        console.debug('result', result)
        if (result === 'OK') {
          this.$form.modal('hide')
          this.$emit('update')
        } else {
          console.debug('Register failed!')
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        }
      } catch (err) {
        console.debug('Register failed', err)
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }

      this.isLoading = false
    },
    notifyError (message = 'An error occurred while trying to send request') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    refreshModal () {
      setTimeout(() => {
        // console.debug('refreshing modal')
        this.$form.modal('refresh')
      }, 50)
    }
  }
}
</script>
