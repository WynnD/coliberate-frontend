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
      <accordion-item
        v-for="featureId in release.features"
        :key="featureId"
        :id="`feature-list-${featureId}`"
        @toggle-accordion-state="toggleAccordionState"
        :name="`feature-list-${featureId}`"
        :showing-boolean="activeAccordion === `feature-list-${featureId}`">
        <section slot="title">
          <i class="dropdown icon"/>
          <span>{{ features[featureId].name }}</span>
          <div class="ui buttons right floated compact">
            <button
              @click.stop="featureEditHandler(featureId)"
              class="ui inverted violet icon button">
              <i class="icon edit"/>
            </button>
            <button
              @click.stop="featureRemoveHandler(featureId)"
              class="ui inverted red icon button">
              <i class="icon trash"/>
            </button>
          </div>
        </section>

        <section slot="content">
          {{ features[featureId].description }}
          <hr>
          Also buttons/links for edit/remove interactions will be here
        </section>
      </accordion-item>
    </div>
  </div>
</template>

<script>
import SegmentAccordionItem from '@/components/Projects/SegmentAccordionItem'

export default {
  components: {
    'accordion-item': SegmentAccordionItem
  },
  props: {
    release: {
      required: true,
      type: Object
    },
    features: {
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
  methods: {
    toggleAccordionState (field) {
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
    },
    featureEditHandler (featureId) {
      console.debug('Clicked edit for', featureId)
    },
    featureRemoveHandler (featureId) {
      console.debug('Clicked remove for', featureId)
    }
  }
}
</script>
