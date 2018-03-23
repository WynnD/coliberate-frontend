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
          {{ features[featureId].name }}
        </section>

        <section slot="content">
          {{ features[featureId].description }}
          <hr>
          Also buttons/links for edit/remove interactions will be here
        </section>
      </accordion-item>
      <!-- <div class="ui three stackable raised cards">
        <div
          v-for="featureId in release.features"
          :key="featureId"
          :id="featureId"
          class="ui card">
          <div class="content">
            <div class="header">{{ features[featureId].name }}</div>
            <div class="description">
              <p>{{ features[featureId].description }}</p>
              <hr>
              Also buttons/links for edit/remove interactions will be here
            </div>
          </div>
        </div>
      </div> -->
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
      console.debug(field)
      if (this.activeAccordion === field) {
        this.activeAccordion = ''
      } else {
        this.activeAccordion = field
      }
    }
  }
}
</script>
