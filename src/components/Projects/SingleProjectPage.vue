<template>
  <div>This is a project page for {{ projectId }}</div>
</template>

<script>
export default {
  computed: {
    projectId () {
      return this.$route.params.id
    }
  }
}
</script>
