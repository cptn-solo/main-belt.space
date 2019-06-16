<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('noscatter', {
      cpu: 'cpu',
      net: 'net',
      ram: 'ram'
    })
  }  
}
</script>
<template>
  <div class="panel">
    <span class="caption">cpu:</span><span class="value">{{ (cpu*100).toFixed(1)+'%' }}</span>&nbsp;
    <span class="caption">net:</span><span class="value">{{ (net*100).toFixed(1)+'%' }}</span>&nbsp;
    <span class="caption">ram:</span><span class="value">{{ (ram*100).toFixed(1)+'%' }}</span>
  </div>
</template>
<style scoped>
.panel {
  width: 240px; padding: 0px 4px 0px 4px; border: 1px solid gray; border-radius: 5px;
}
.caption {
  font-size: small; color: gray;
}
.value {
  font-weight: normal
}
</style>

