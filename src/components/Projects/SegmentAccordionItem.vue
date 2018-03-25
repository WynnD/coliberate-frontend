<template>
  <div class="ui segments">
    <div
      @click="$emit('toggle-accordion-state', name)"
      :class="{
        'ui segment accord-title': true,
        'accord-active': showingBoolean
      }"
    >
      <slot name="title">
        Your Accordion Title goes here
      </slot>
    </div>
    <div
      v-show="showingBoolean"
      class="ui segment accord-content">
      <slot name="content">
        Your Accordion Content goes here
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showingBoolean: {
      required: true,
      type: Boolean
    },
    name: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped>
.accord-title {
  background-color: #EEE;
}

.accord-title:hover {
  cursor: pointer;
  background-color: gainsboro;
}

.accord-title.accord-active:not(:hover) {
  background-color: lightgray;
}

.accord-title .icon.dropdown {
  transform: rotate(-90deg);
}

.accord-title.accord-active .icon.dropdown {
  transform: rotate(0deg);
}
</style>
