<script>
let interval = null
export default {
  props: {
    deadline: {
      type: Number,
      default: null,
    },
    end: {
      type: Number,
      default: null,
    },
    stop: {
      type: Boolean,
    },
  },
  filters: {
    twoDigits:(value) => {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
      date: null,
      diff: 0,
    }
  },
  computed: {
    seconds() {
      return Math.trunc(this.diff) % 60
    },
    minutes() {
      return Math.trunc(this.diff / 60) % 60
    },
    hours() {
      return Math.trunc(this.diff / 60 / 60) % 24
    },
    days() {
      return Math.trunc(this.diff / 60 / 60 / 24)
    },
  },
  watch: {
    deadline(value) {
      clearInterval(interval)
      this.initializeCountdown()
    },
    now(value) {
      this.diff = this.date - this.now
      if (this.diff <= 0 || this.stop) {
        this.diff = 0
        clearInterval(interval)
        this.$emit('onend')
      }
    },
  },
  created() {
    this.initializeCountdown()
  },
  destroyed() {
    clearInterval(interval)
  },
  methods: {
    initializeCountdown() {
      try {
        if (!this.deadline && !this.end) {
          throw new Error("Missing props 'deadline' or 'end'")
        }
        let endTime = this.deadline ? this.deadline : this.end
        this.date = new Date(endTime / 1000)
        if (!this.date) {
          throw new Error(
            "Invalid props value, correct the 'deadline' or 'end'"
          )
        }
        interval = setInterval(() => {
          this.now = Math.trunc(new Date().getTime() / 1000)
        }, 1000)
      } catch (ex) {
        // skipped
      }
    },
  },
}
</script>
<template>
    <v-layout row align-center justify-center pa-0>
      <span flex>{{ hours | twoDigits }}</span>
      <span flex>:</span>
      <span flex>{{ minutes | twoDigits }}</span>
      <span flex>:</span>
      <span flex>{{ seconds | twoDigits }}</span>
    </v-layout>
</template>