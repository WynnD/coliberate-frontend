<template>
  <div class="activity-item event">
    <div class="content">
      <div class="summary">
        <span v-if="date">
          <b>[<abbr :title="localDate">{{ dateDifference }}</abbr>]</b>
        </span>
        <span v-html="content"/>
      </div>
      <div
        v-if="meta"
        class="meta"
        v-html="meta"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      required: true,
      type: String
    },
    date: {
      required: false,
      type: String,
      default: ''
    },
    meta: {
      required: false,
      type: String,
      default: ''
    }
  },
  computed: {
    dateDifference () {
      if (!this.date) {
        return ''
      }

      return this.getDateDifference(new Date(), new Date(this.date))
    },
    localDate () {
      return this.date ? new Date(this.date).toLocaleString() : new Date().toLocaleString()
    }
  },
  methods: {
    getDateDifference (older, newer, valuesOnly = false) {
      const difference = new Date(Math.abs(newer - older))
      const attributes = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }

      const ignoredAttributes = ['millisecond']

      // conversion from this to milliseconds
      const constants = {
        millisecond: 1,
        second: 1000,
        minute: 1000 * 60,
        hour: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24
      }

      const divide = (numerator, denominator) => {
        return {
          quotient: parseInt(numerator / denominator),
          remainder: numerator % denominator
        }
      }

      // convert time in ms to various attributes
      let total = difference.getTime()
      Object.keys(attributes)
        .forEach((attr) => {
          if (total > constants[attr]) {
            const result = divide(total, constants[attr])
            attributes[attr] = result.quotient
            total = result.remainder
          }
        })

      if (valuesOnly) {
        return attributes
      }

      const msg = Object.keys(attributes)
        .filter(attr => ignoredAttributes.indexOf(attr) === -1 && attributes[attr] > 0)
        .map(attr => {
          const value = attributes[attr]
          return `${value} ${value === 1 ? attr : `${attr}s`}`
        })

      return msg[0] ? `${msg[0]} ${newer - older < 0 ? 'ago' : 'from now'}` : 'Now'
    }
  }
}
</script>

<style>
.activity-list>.ui.feed>.activity-item.event>.content .meta {
  margin-left: 1rem;
}
</style>
