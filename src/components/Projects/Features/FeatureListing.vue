<template>
  <div class="ui segments">
    <div class="ui inverted grey segment">
      <span class="ui header">Features ({{ numFeatures }})</span>
      <a
        @click="$emit('showmodal', 'feature-create')"
        class="ui right floated compact white inverted icon button">
        <i class="plus icon"/>
      </a>
    </div>
    <div
      v-if="release.features.length > 0"
      class="ui segment">
      <feature-accordion-item
        v-for="featureId in release.features"
        :key="featureId"
        :id="`feature-list-${featureId}`"
        :feature="features[featureId]"
        :active-accordion="activeAccordion"
        @toggle-accordion-state="toggleAccordionState"
        :stories="stories"
        :tasks="tasks"
        @showmodal="showModal"
      />
    </div>
  </div>
</template>

<script>
import SingleTaskCard from '@/components/Projects/Tasks/SingleTaskCard'
import FeatureAccordionItem from '@/components/Projects/Features/FeatureAccordionItem'

export default {
  components: {
    'task-card': SingleTaskCard,
    'feature-accordion-item': FeatureAccordionItem
  },
  props: {
    release: {
      required: true,
      type: Object
    },
    features: {
      required: true,
      type: Object
    },
    stories: {
      required: true,
      type: Object
    },
    tasks: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      activeAccordion: ''
    }
  },
  computed: {
    numFeatures () {
      return this.release.features.length
    }
  },
  watch: {
    release () {
      this.activeAccordion = 'feature-list-'
    },
    activeAccordion (newValue = '') {
      if (newValue.indexOf('feature-list') > -1) {
        const featureId = newValue.split('feature-list-')[1]
        this.$emit('changefeature', featureId)
      }
    }
  },
  methods: {
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
    },
    showModal (type) {
      this.$emit('showmodal', type)
    }
  }
}
</script>
