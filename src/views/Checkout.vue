<template>
  <div class="flex-column outer-panel">
    <VueQrcode class="mt1" :value="qrcodeAddress" :options="{ size: 250 }"></VueQrcode>
    <div class="mt1">{{ address }}</div>
    <div class="mt1 sf">{{ message }}</div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'

const eventToListenTo = 'tx'
const room = 'inv'

export default {
  name: 'Checkout',
  props: {
    network: String,
    address: String,
    amount: Number,
  },
  data: function() {
    return  {
      qrcodeAddress: '',
      message: ""
    }
  },
  beforeMount(){
    this.qrcodeAddress = `bitcoin:${this.address}`    
  },
  components: {
    VueQrcode
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
