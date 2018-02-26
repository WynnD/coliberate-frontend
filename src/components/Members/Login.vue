<template>
  <form
    id="login-form"
    class="ui container form">
    <div class="field">
      <label>Email</label>
      <input
        type="text"
        name="email"
        v-model="username">
    </div>
    <div class="field">
      <label>Password</label>
      <input
        type="password"
        name="password"
        v-model="password">
    </div>
    <div class="ui error message">
      <div class="header">Error</div>
      <p>An error has occurred</p>
    </div>
    <button
      type="submit"
      class="ui blue button">
      Login
    </button>
  </form>
</template>

<script>
/* global $ */
export default {
  data () {
    return {
      username: 'johnsmith@company.com',
      password: 'password',
      $form: undefined
    }
  },
  mounted () {
    this.$form = $(this.$el)

    this.$form.submit((e) => {
      e.preventDefault()
      this.login()
    })
  },
  methods: {
    async login () {
      // eslint-disable-next-line
      console.debug("Sending login info:", this.username, this.password)

      try {
        const result = await this.sendLoginData(this.username, this.password)

        if (result.status !== 200) {
          this.notifyError(result.error)
        } else {
          this.$router.replace({ path: '/projects' })
        }
      } catch (err) {
        this.notifyError(err)
      }
    },
    sendLoginData (username, password) {
      // TODO: Replace with actual login code
      return Promise.resolve()
        .then(() => {
          if (username !== 'johnsmith@company.com' || password !== 'password') {
            return { error: 'Invalid login' }
          }

          return { status: 200 }
        })
    },
    notifyError (message = 'An error occurred while trying to login') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    }
  }
}
</script>

<style>
#login-form {
  z-index: 102;
  padding-top: 2.85em;
  margin-top: -2.85em;
  background-color: white;
  width: 100%;
}
</style>
