<template>
  <div>
    Details: {{ project }}
  </div>
</template>

<script>
export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  }
}
</script>
