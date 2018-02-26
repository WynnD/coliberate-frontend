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
          type="text"
          name="name"
          v-model="name">
      </div>
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
      id: this.generateRandomID(),
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
    generateRandomID () {
      // eslint-disable-next-line
      console.warn('TODO: check if ID exists before returning')
      return Math.floor(Math.random() * 10000)
    },
    async login () {
      const accountData = {
        email: this.username.trim(),
        password: this.password,
        name: this.name.trim(),
        id: this.id
      }
      // eslint-disable-next-line
      console.debug("Sending register info:", accountData)

      try {
        const result = await this.sendRegisterData(accountData)

        if (result.status !== 200) {
          // eslint-disable-next-line
          console.debug("Register failed!", result);
          this.notifyError(result.error)
        } else {
          const accountData = result.data
          this.$store.commit('login', accountData)
          this.$router.push({ path: '/projects' })
        }
      } catch (err) {
        // eslint-disable-next-line
        console.debug("Login failed!", err);
        this.notifyError(err)
      }
      this.$form.removeClass('loading')
    },
    sendRegisterData (accountData = {}) {
      // TODO: Replace with actual login code

      const simulateDelay = (msDelay) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, msDelay)
        })
      }

      this.$form.addClass('loading')
      return simulateDelay(1500)
        .then(() => {
          if (!accountData.name || accountData.name.trim().length === 0) {
            return { error: 'Name field is empty' }
          } else if (!accountData.email || accountData.email.trim().length === 0) {
            return { error: 'Email field is empty' }
          } else if (!accountData.password || accountData.password.trim().length === 0) {
            return { error: 'Password field is empty' }
          }

          return {
            status: 200,
            data: { // create new object to avoid unnecessary fields
              id: accountData.id,
              name: accountData.name,
              email: accountData.email
            }
          }
        })
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
