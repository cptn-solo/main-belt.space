<script>
  const MAX_TRIES = 3
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
      canTry() { return this.player.triesleft > 0 && this.player.levelresult === 1 },
      canCommitTry() { return this.player.triesleft < MAX_TRIES && this.player.levelresult === 1 },
    },
    methods: {
      tryturn() {},
      committurn() {},
      claimgreen() {},
      claimred() {},
      claimtake() {},
      untake() {},
      takelvl() {},
      unjail() {},
      nextlvl() {},
      unlocklvl() {},
      cellPositionStyle(idx) {
        const r = 120
        const fi = (360/16) * idx * (Math.PI/180)
        const x = r*Math.cos(fi) + 140
        const y = r*Math.sin(fi) + 140
        const position = "left: "+(Math.floor(x))+"px; top: "+(Math.floor(y))+"px;"
        return position
      },
      cellValueClasses(idx) {
        if (!this.level)
          return ['cell']//no classes for level, only board markup
        
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
    <div v-for="(cell,idx) in levelCells" :key="idx"
      :class="cellValueClasses(idx)"  
      :style="cellPositionStyle(idx)"
    >{{ idx }}</div>
    <div class="hud">
      <v-layout row justify-center align-center fill-height>
        <v-btn v-if="canTry" fab color="primary" class="trybtn"
          @click="tryturn">try</v-btn>
        <v-btn v-if="canCommitTry" fab color="secondary" class="commitbtn"
          @click="committurn">try</v-btn>
      </v-layout>
    </div>    
  </div>  
</template>
<style scoped>
  .hud {
    position: absolute;
    width: 180px;
    height: 90px;
    left: 50%;    
    margin-left: -90px;
    top: 50%;
    margin-top: -45px;
    border: 1px solid gray;
    border-radius: 15px;
  }
  .wflbox {
    position: absolute;
    width: 280px;
    height: 280px;
    left: 50%;
    margin-left: -140px;
    top: 50%;
    margin-top: -140px;
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



