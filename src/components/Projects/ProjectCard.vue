<template>
  <div class="ui card">
    <div class="content">
      <div class="header">{{ projectData.name }}</div>
    </div>
    <div class="content">
      <h4 class="ui sub header"><b>About</b></h4>
      <div class="ui small feed">
        <div class="event">
          <div class="content">
            <div class="summary">
              {{ projectData.description }}
            </div>
          </div>
        </div>
      </div>
      <div class="ui divider"/>
      <h4 class="ui sub header"><b>Activity</b></h4>
      <div class="ui small feed">
        <div class="event">
          <div class="content">
            <div class="summary">
              <a>Elliot Fu</a> added <a>Jenny Hess</a> to the project
            </div>
          </div>
        </div>
        <div class="event">
          <div class="content">
            <div class="summary">
              <a>Stevie Feliciano</a> was added as an <a>Administrator</a>
            </div>
          </div>
        </div>
        <div class="event">
          <div class="content">
            <div class="summary">
              <a>Helen Troy</a> added two pictures
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="extra content">
      <router-link
        :to="routerLink"
        class="ui button">Open Project</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    projectData: {
      type: Object,
      required: true
    }
  },
  computed: {
    routerLink () {
      return `/projects/${this.projectData.id}`
    }
  }
}
</script>
