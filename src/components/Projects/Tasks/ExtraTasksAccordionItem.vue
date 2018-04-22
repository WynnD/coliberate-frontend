<template>
  <accordion-item
    @toggle-accordion-state="toggleAccordionState"
    :name="name"
    :showing-boolean="showingBoolean">
    <section slot="title">
      <i class="dropdown icon"/>
      <span>Extra Tasks</span>
      <div
        :class="{
          'ui left pointing label': true,
          yellow: numUnfinishedTasks > 0
        }"
      >
        {{ numUnfinishedTasks }} REMAINING
      </div>
    </section>
    <section slot="content">
      <div class="ui fluid container grid">
        <div class="row">
          <div class="sixteen wide column">
            <span class="ui small header">
              Tasks ({{ numUnfinishedTasks }}/{{ assignedTaskList.length }} Remaining)
            </span>
            <a
              v-if="showButtons"
              @click="$emit('showmodal', 'task-create')"
              class="ui right floated compact icon button">
              <i class="plus icon"/>
              Add Task
            </a>
          </div>
        </div>
        <div class="row">
          <div class="sixteen wide column">
            <div class="ui three stackable cards">
              <task-card
                v-for="task in tasks"
                :key="task.id"
                @showmodal="showModal"
                :task="task"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  </accordion-item>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

export default {
  components: {
    'task-card': SingleTaskCard,
    'accordion-item': SegmentAccordionItem
  },
  props: {
    name: {
      required: true,
      type: String
    },
    showingBoolean: {
      required: true,
      type: Boolean
    },
    assignedTaskList: {
      required: true,
      type: Array
    },
    allTasks: {
      required: true,
      type: Object
    },
    showButtons: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  computed: {
    tasks () {
      return this.assignedTaskList.map(id => this.allTasks[id])
    },
    numUnfinishedTasks () {
      return this.tasks.filter(task => task.status !== 'done').length
    }
  },
  methods: {
    toggleAccordionState (name) {
      this.$emit('toggle-accordion-state', name)
    },
    showModal (data) {
      this.$emit('showmodal', data)
    }
  }
}
</script>
