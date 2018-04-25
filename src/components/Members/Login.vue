<template>
  <div
    id="login-form"
    class="ui container fluid">
    <form class="ui container form left aligned">
      <h1 class="ui header">Coliberate</h1>
      <h2 class="ui header">Login</h2>
      <div class="field">
        <label>Username</label>
        <input
          v-model="username"
          type="text"
          name="username"
          placeholder="Username">
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
      <router-link
        to="/register"
        class="ui basic orange left floated button">
        Not a member yet? Register here.
      </router-link>
      <div class="or"/>
      <button
        type="submit"
        class="ui blue right floated button">
        Login
      </button>
      <button
        v-if="$store.getters.isDevelopmentMode"
        class="ui black fluid button"
        @click="debugLoginHandler">
        Developer Auto-Login
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/* global $ */
export default {
  data () {
    return {
      username: 'johnsmith@company.com',
      password: 'password',
      $form: undefined,
      isLoading: false
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
    this.$form = $(this.$el).find('.ui.form')

    this.$form.submit((e) => {
      e.preventDefault()
      this.loginHandler()
    })
  },
  methods: {
    ...mapGetters(['server']),
    async loginHandler () {
      // eslint-disable-next-line
      console.debug("Sending login info:", this.username, this.password)
      this.isLoading = true

      try {
        const result = await this.login(this.username, this.password)
        console.debug('login result', result)
        if (result.status !== 200) {
          // eslint-disable-next-line
          console.debug("Login failed!");
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
      this.isLoading = false
    },
    login (username, password) {
      const apiUrl = 'api/login'
      const payload = { username, password }
      return this.server().postToServer({ apiUrl, payload })
    },
    notifyError (message = 'An error occurred while trying to login') {
      this.$form.find('.ui.message p').text(message)
      this.$form.addClass('error')
    },
    // used for "logging in" when server is unavailable
    async debugLoginHandler () {
      try {
        const result = await this.debugLogin(this.username, this.password)

        if (result.status !== 200) {
          // eslint-disable-next-line
          console.debug("Login failed!", result);
          this.notifyError(result.responseJSON ? result.responseJSON.error : (result.statusText || result.error))
        } else {
          const accountData = result.data
          this.$store.commit('login', accountData)
          this.$router.push({ path: '/projects' })
        }
      } catch (err) {
        // eslint-disable-next-line
        console.debug("Login failed!", err);
        const message = `${err.status}: ${err.statusText}`
        this.notifyError(err.responseJSON ? err.responseJSON.error : (err.statusText || message))
      }
      this.isLoading = false
    },
    async debugLogin (username, password) {
      console.debug('using debug login')
      this.isLoading = true
      const simulateDelay = (msDelay) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, msDelay)
        })
      }
      await simulateDelay(1500)
      if (username !== 'johnsmith@company.com' || password !== 'password') {
        return { error: 'Invalid login' }
      }

      return {
        status: 200,
        data: {
          id: 1,
          name: 'John Smith',
          email: 'johnsmith@company.com',
          password: 'password',
          username: 'johnsmith@company.com'
        }
      }
    }
  }
}
</script>

<style>
#login-form {
  position: relative;
  z-index: 102; /* one above top navbar */
  padding-top: 5.5em;
  margin-top: -5.5em;
  background-color: white;
  width: 100%;
}
</style>
