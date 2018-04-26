<template>
  <div class="ui project card">
    <div class="content">
      <div class="header">
        <div class="ui unstackable grid">
          <div class="twelve wide column">
            {{ name }}
          </div>
          <div class="right aligned four wide column">
            <button
              @click="deleteHandler"
              class="ui icon basic button compact">
              <i class="close icon"/>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <h4 class="ui sub header"><b>About</b></h4>
      <div class="ui small feed">
        <div class="event">
          <div class="content">
            <div class="meta">
              Created {{ startDate }}
            </div>
            <div class="summary">
              {{ description }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <span class="ui sub header">Recent Activity</span>
      <activity-list :activities="project.auditLog"/>
    </div>
    <div class="extra content">
      <router-link
        :to="routerLink"
        class="ui fluid button">Open Project</router-link>
    </div>
  </div>
</template>

<script>
import ActivityList from '@/components/Projects/ActivityList'

export default {
  components: {
    'activity-list': ActivityList
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    routerLink () {
      return `/projects/${this.project.id}`
    },
    name () {
      return this.project.name
    },
    description () {
      return this.project.description
    },
    activities () {
      return this.project.activities
    },
    startDate () {
      if (this.project.auditLog) {
        return new Date(this.project.auditLog[this.project.auditLog.length - 1].date).toDateString()
      }
      return new Date().toDateString()
    }
  },
  methods: {
    deleteHandler () {
      console.debug('clicked remove for', this.project.id)
      this.$emit('showmodal', `project-remove|${this.project.id}`)
    }
  }
}
</script>

<style>
.ui.project.card .content .content.activity-list>.ui.small.feed .activity-item .content .summary {
  color: gray;
}

.ui.project.card .content>.ui.small.feed {
  margin-top: 0;
}

.ui.project.card .content>.ui.small.feed>.event>.content>.summary {
  font-weight: inherit;
}

.ui.project.card>.content {
  border-top: 1px solid rgba(34,36,38, 0.25);
}
</style>
