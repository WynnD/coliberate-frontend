<template>
  <div class="ui three stackable raised cards">
    <overview-card :project="project"/>
  </div>
</template>

<script>
import OverviewCard from "@/components/Projects/Cards/OverviewCard";

export default {
  components: {
    "overview-card": OverviewCard
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
  }
}
</script>
