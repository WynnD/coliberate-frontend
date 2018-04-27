<template>
  <div
    id="single-task-card"
    class="ui fluid task-card card">
    <div class="content">
      <div class="header">
        <div class="ui unstackable grid">
          <div class="twelve wide column">
            {{ task.name }}
          </div>
          <div class="right aligned four wide column">
            <button
              v-if="showButtons"
              id="fab"
              class="ui icon top left pointing dropdown button compact">
              <i class="wrench icon"/>
              <div class="menu">
                <div class="item">Edit</div>
                <div class="item">Delete</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="header">
        <div :class="ribbonClass">
          <div
            id="status"
            class="ui right pointing dropdown">
            <div class="text">{{ task.status.toUpperCase() }}</div>
            <i class="dropdown icon"/>
            <div class="menu">
              <div
                value="todo"
                class="item">
                TODO
              </div>
              <div
                value="in-progress"
                class="item">
                IN-PROGRESS
              </div>
              <div
                value="done"
                class="item">
                DONE
              </div>
            </div>
          </div>
        </div>
        <span class="left floated">
          ({{ task.points }} points)
        </span>
      </div>
      <div class="description">
        <p><b>Description:</b></p>
        <p>
          {{ task.description }}
        </p>
      </div>
      <hr>
      <div class="description">
        <div class="ui sub header">Taken By:</div>
        <span v-if="task.takenBy.length === 0">Nobody</span>
        <span v-else>
          {{ memberNames.join(', ') }}
        </span>
      </div>
    </div>
    <div class="extra content">
      <slot>
        <button
          v-show="showButtons && !isTaken"
          @click="takeTaskHandler"
          class="ui fluid button">
          Take this task
        </button>
        <button
          v-show="showButtons && isTaken"
          @click="dropTaskHandler"
          class="ui fluid inverted red button">
          Drop this task
        </button>
      </slot>
    </div>
    <div class="ui inverted dimmer">
      <div class="ui loader"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

/* global $ */
export default {
  props: {
    task: {
      required: true,
      type: Object
    },
    showButtons: {
      required: false,
      type: Boolean,
      default: true
    },
    projectId: {
      required: false,
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['memberById', 'currentUser', 'server']),
    ribbonClass () {
      const status = this.task.status.toLowerCase()
      return {
        'ui right ribbon label': true,
        red: status === 'todo',
        yellow: status === 'in-progress',
        green: status === 'done'
      }
    },
    memberNames () {
      return this.task.takenBy
        .map(id => this.memberById(id) || { name: `Unknown (${id})` })
        .map(m => m.name)
    },
    isTaken () {
      return this.task.takenBy.indexOf(this.currentUser.id) > -1
    },
    baseApiUrl () {
      return `api/projects/${this.projectId}/tasks/${this.task.id}?member_id=${this.currentUser.id}`
    }
  },
  mounted () {
    $(this.$el).find('.ui.dropdown#fab').dropdown({
      onChange: this.dropdownChangeHandler
    })

    $(this.$el).find('.ui.dropdown#status').dropdown({
      action: 'select',
      onChange: this.statusChangeHandler
    })
  },
  methods: {
    async statusChangeHandler (value) {
      console.debug('clicked', value, 'on status dropdown')
      if (!value) {
        return
      }
      try {
        if (!this.projectId) {
          throw Error('project ID not specified')
        }
        await this.sendEdit({
          ...(this.task),
          status: value
        })
      } catch (err) {
        console.error(err)
      }
    },
    dropdownChangeHandler (value) {
      console.debug('clicked', value, 'on fab dropdown')
      if (value === 'edit') {
        this.taskEditHandler()
      } else if (value === 'delete') {
        this.taskRemoveHandler()
      }
    },
    taskEditHandler () {
      console.debug('clicked edit for', this.task.id)
    },
    taskRemoveHandler () {
      console.debug('clicked remove for', this.task.id)
      this.$emit('showmodal', `task-remove|${this.task.id}`)
    },
    generateApiUrl (task = {}) {
      const taskDataUrl = encodeURIComponent(JSON.stringify(task))
      return `${this.baseApiUrl}&task=${taskDataUrl}`
    },
    async sendEdit (task) {
      const url = this.generateApiUrl(task)
      console.debug('sending task edit', { url, task })
      const loader = $(this.$el).find('.ui.dimmer')
      loader.addClass('active')
      try {
        const result = await this.server.putToServer(url)
        console.debug('result', result)
        if (result === 'OK') {
          this.$emit('update')
        }
      } catch (err) {
        console.debug('edit failed', err)
      } finally {
        loader.removeClass('active')
      }
    },
    async takeTaskHandler () {
      if (!this.projectId) {
        throw Error('project ID not specified')
      }
      if (this.task.takenBy.includes(this.currentUser.id)) {
        return
      }

      const newTakenBy = this.task.takenBy.slice()
      newTakenBy.push(this.currentUser.id)
      console.debug('would\'ve taken task with takenBy', newTakenBy)
      try {
        await this.sendEdit({
          ...(this.task),
          takenBy: newTakenBy
        })
      } catch (err) {
        console.error(err)
      }
    },
    async dropTaskHandler () {
      if (!this.projectId) {
        throw Error('project ID not specified')
      }
      if (!this.task.takenBy.includes(this.currentUser.id)) {
        return
      }

      const newTakenBy = this.task.takenBy.filter(id => id !== this.currentUser.id)
      console.debug('would\'ve taken task with takenBy', newTakenBy)
      try {
        await this.sendEdit({
          ...(this.task),
          takenBy: newTakenBy
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style>
#single-task-card .header .left.floated {
  margin-right: -20rem;
}
</style>
