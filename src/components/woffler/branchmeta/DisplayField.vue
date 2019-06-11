<script>
export default {
  props: {
    value: { type: Object, default: () => ({ key: null, type: 'text', val: null }) }
  },
  computed: {
    valueType() {
      return this.value.type.split[0]
    }
  }
}
</script>

<template>
  <div>
    {{$t('wflBrMeta'+value.key)}}:&nbsp;
    <b v-if="valueType === 'bool'">{{$t('miskYESNO'+value.val)}}</b>
    <b v-else>
      <span>{{ value.val }}</span>
      <span v-if="valueType === '%'">%</span>
      <span v-else-if="valueType === 'interval'">&nbsp;{{$t('miskSeconds')}}</span>
    </b>
    <div class="subtitle">
      {{$t('wflBrMeta'+value.key+'h')}}
    </div>
  </div>  
</template>
<style scoped>
.subtitle {
  font-size: smaller;
  text-align: left;
}
</style>

