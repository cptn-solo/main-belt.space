<script>
  export default {
    props: {
      player: {
        type: Object,
        default: null
      }
    },
    data: () => ({
      showMenu: false,
      levelCells: [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
      ]
    }),
    computed: {
    },
    methods: {
      cellStyle(idx) {
        const r = 125-18
        const fi = (360/16) * idx * (Math.PI/180)
        const x = r*Math.cos(fi) + 125
        const y = r*Math.sin(fi) + 125
        return "left: "+(Math.floor(x))+"px; top: "+(Math.floor(y))+"px;"
      }
    }
  }
</script>
<template>
  <div class="wflbox">
    <div class="cell" v-for="(cell,idx) in levelCells" :key="idx" :style="cellStyle(idx)">
      {{ idx }}
    </div>    
  </div>  
</template>
<style scoped>
  .wflbox {
    position: absolute;
    left: 50%;
    margin-left: -125px;
    top: 50%;
    margin-top: -125px;
    width: 250px;
    height: 250px;
    border: gray 1px solid
  }
  .cell {
    position: absolute;    
    width: 30px;
    height: 30px;
    border: 1px solid gray;
    line-height: 30px;
    border-radius: 15px;
    margin-left: -15px;
    margin-top: -15px
  }
</style>



