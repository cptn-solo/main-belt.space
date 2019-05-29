<script>
import NProgress from 'nprogress/nprogress'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    loading(n, o) {
      if (n) NProgress.start()
      else NProgress.done()
    },
  },
  created() {
    if (this.loading) NProgress.start()
    else NProgress.done()
  },
  methods: {
    loadData() {
      this.$emit('click')
    },
  },
}
</script>
<template>
  <VBtn
    flat
    icon
    color="green"
    :disabled="loading"
    @click="loadData"
  >
    <VProgressCircular
      v-if="loading"
      indeterminate
      color="green"
    />
    <VIcon v-if="!loading">
      cached
    </VIcon>
  </VBtn>
</template>
