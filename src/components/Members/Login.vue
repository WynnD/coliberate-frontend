<template>
  <div
    id="login-form"
    class="ui container fluid">
    <form class="ui container form left aligned">
      <h1 class="ui header">Coliberate</h1>
      <h2 class="ui header">Login</h2>
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
        class="ui blue fluid button">
        Login
      </button>
    </form>
  </div>
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
    this.$form = $(this.$el).find('.ui.form')

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
          // eslint-disable-next-line
          console.debug("Login failed!", result);
          this.notifyError(result.error)
        } else {
          const accountData = result.data
          this.$store.commit('login', accountData)
          this.$router.replace({ path: '/projects' })
        }
      } catch (err) {
        // eslint-disable-next-line
        console.debug("Login failed!", err);
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

          return {
            status: 200,
            data: {
              id: 1,
              name: 'John Smith',
              email: 'johnsmith@company.com'
            }
          }
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
  position: relative;
  z-index: 102; /* one above top navbar */
  padding-top: 2.85em;
  margin-top: -2.85em;
  background-color: white;
  width: 100%;
}
</style>
