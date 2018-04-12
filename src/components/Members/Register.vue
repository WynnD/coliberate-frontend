<template>
  <div
    id="login-form"
    class="ui container fluid">
    <form class="ui container form left aligned">
      <h1 class="ui header">Coliberate</h1>
      <h2 class="ui header">Register</h2>
      <div class="field">
        <label>Name</label>
        <input
          v-model="name"
          type="text"
          name="name">
      </div>
      <div class="field">
        <label>Username</label>
        <input
          v-model="username"
          type="text"
          name="username">
      </div>
      <div class="field">
        <label>Email</label>
        <input
          v-model="email"
          type="text"
          name="email">
      </div>
      <div class="field">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          name="password">
      </div>
      <div class="ui error message">
        <div class="header">Error</div>
        <p>An error has occurred</p>
      </div>
      <button
        type="submit"
        class="ui orange right floated button">
        Register
      </button>
      <router-link
        to="/login"
        class="ui basic blue left floated button">
        Already a member? Log in here.
      </router-link>
    </form>
  </div>
</template>

<script>
/* global $ */
export default {
  data () {
    return {
      username: '',
      password: '',
      name: '',
      email: '',
      id: this.generateRandomID(),
      $form: undefined
    }
  },
  mounted () {
    this.$form = $(this.$el).find('.ui.form')

    this.$form.submit((e) => {
      e.preventDefault()
      this.registerHandler()
    })
  },
  methods: {
    generateRandomID () {
      // eslint-disable-next-line
      console.warn('TODO: check if ID exists before returning')
      return Math.floor(Math.random() * 10000)
    },
    async registerHandler () {
      const accountData = {
        email: this.email.trim(),
        password: this.password,
        name: this.name.trim(),
        username: this.username.trim(),
        id: this.id
      }
      // eslint-disable-next-line
      console.debug("Sending register info:", accountData)

      try {
        const result = await this.register(accountData)

        if (result.status !== 200) {
          // eslint-disable-next-line
          console.debug("Register failed!", result);
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        } else {
          const accountData = result.data
          this.$store.commit('login', accountData)
          this.$form.removeClass('error')
          this.$router.push({ path: '/projects' })
        }
      } catch (err) {
        // eslint-disable-next-line
        console.debug("Login failed!", err);
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }
      this.$form.removeClass('loading')
    },
    sendRegisterData (accountData) {
      return new Promise((resolve, reject) => {
        const url = this.$store.getters.isDevelopmentMode ? 'http://localhost' : ''
        $.post(`${url}/api/register`, { accountData })
          .done(resolve).fail(reject)
      })
    },
    async register (accountData = {}) {
      // TODO: Replace with actual login code
      if (!accountData.name || accountData.name.trim().length === 0) {
        return { responseJSON: { error: 'Name field is empty' } }
      } else if (!accountData.username || accountData.username.trim().length === 0) {
        return { responseJSON: { error: 'Username field is empty' } }
      } else if (!accountData.email || accountData.email.trim().length === 0) {
        return { responseJSON: { error: 'Email field is empty' } }
      } else if (!accountData.password || accountData.password.trim().length === 0) {
        return { responseJSON: { error: 'Password field is empty' } }
      }

      this.$form.addClass('loading')
      const data = await this.sendRegisterData(accountData)
      // eslint-disable-next-line
      console.debug('login', {data})
      return data
    },
    notifyError (message = 'An error occurred while trying to register') {
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
