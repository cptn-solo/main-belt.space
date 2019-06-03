<script>
  export default {
    props: {
      player: {
        type: Object,
        default: null
      },
      level: {
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
      cellPositionStyle(idx) {
        const r = 120
        const fi = (360/16) * idx * (Math.PI/180)
        const x = r*Math.cos(fi) + 140
        const y = r*Math.sin(fi) + 140
        const position = "left: "+(Math.floor(x))+"px; top: "+(Math.floor(y))+"px;"
        return position
      },
      cellValueClasses(idx) {
        const idxBin = 1<<idx
        const green = (this.level.greencells&idxBin) > 0
        const red = (this.level.redcells&idxBin) > 0
        const currentpos = idx === this.player.currentposition
        const trypos = idx === this.player.tryposition

        let retval = ["cell"]
        if (green || red)
          retval.push(green ? "greenpos" : "redpos")
        
        if (currentpos) 
          retval.push("curpos")
        
        if (trypos && !currentpos)
          retval.push("trypos")
        
        return retval        
      }
    }
  }
</script>
<template>
  <div class="wflbox">
    <div :class="cellValueClasses(idx)" v-for="(cell,idx) in levelCells" :key="idx" :style="cellPositionStyle(idx)">
      {{ idx }}
    </div>    
  </div>  
</template>
<style scoped>
  .wflbox {
    position: absolute;
    left: 50%;
    margin-left: -140px;
    top: 50%;
    margin-top: -140px;
    width: 280px;
    height: 280px;
    border-radius: 140px;
    border: gray 1px solid
  }
  .cell {
    position: absolute;    
    width: 30px;
    height: 30px;
    border: 1px solid gray;
    line-height: 28px;
    border-radius: 15px;
    margin-left: -15px;
    margin-top: -15px
  }
  .greenpos {
    border-color: green
  }
  .redpos {
    border-color: red
  }
  .curpos {
    border-width: 2px;
    font-weight: bolder
  }
  .trypos {
    border-width: 2px;
    border-style: dotted

  }
</style>



