<script>
  import utils from '../../utils'

  const LEVEL_LENGTH = 16
  const MAX_TRIES = 3
  const PALYER_STATE = {
    INIT: 0, SAFE: 1, RED: 2, GREEN: 3, TAKE: 4
  }
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
      levelLength: LEVEL_LENGTH
    }),
    computed: {
      takeAmount() {
        try {
          const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
          const tkrate = this.level.branch.meta.tkrate
          const potmin = parseFloat(this.level.branch.meta.potmin.split(' ')[0])

          const amount = utils.parseAmount((potbalance * tkrate) / 100)
          const remains = potbalance - amount

          return remains > potmin ? utils.asset(amount) : null
        } catch (error) {
          return null
        }
      },
      unjailAmount() {
        try {
          const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
          const unjlrate = this.level.branch.meta.unjlrate
          const unjlmin = parseFloat(this.level.branch.meta.unjlmin.split(' ')[0])

          const amount = utils.parseAmount((potbalance * unjlrate) / 100)
          const asset = utils.asset(Math.max(amount, unjlmin))
          return asset

        } catch (error) {
          return null
        }
      },
      canTry() {
        return this.player.levelresult === PALYER_STATE.SAFE
          && this.player.triesleft > 0
      },
      canCommitTry() {
        return this.player.levelresult === PALYER_STATE.SAFE
          && this.player.triesleft < MAX_TRIES
      },
      canNext() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && (!this.level.next || !this.level.next.locked)
      },
      canSplit() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && !this.level.split
      },
      canTake() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && this.takeAmount
      },
      canUntake() {
        return this.player.levelresult === PALYER_STATE.TAKE
          && this.player.resulttimestamp > ((new Date()).getTime / 1000)
      },
      canClaimRed() {
        return this.player.levelresult === PALYER_STATE.RED
          && (this.level.idparent > 0 || this.level.branch.meta.startjailed === 0)
      },
      canUnjail() {
        return this.player.levelresult === PALYER_STATE.RED
      },
      canClaimGreen() {
        return this.player.levelresult === PALYER_STATE.GREEN
      },
      canUnlockNext() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && this.level.next
          && this.level.next.locked
          && this.player.triesleft > 0
      },
      canUnlockSplit() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && this.level.split
          && this.level.split.locked
          && this.player.triesleft > 0
      },
      canSwitchToSplit() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && this.level.split
          && !this.level.split.locked
      }

    },
    methods: {
      tryturn() {
        const payload = 'tryturn'
        this.$store.dispatch('engine/enqueueAction', { 
          title: 'tryturn', selector: 'woffler/playerAction', payload, lock: true
        })
      },
      committurn() {
        const payload = 'committurn'
        this.$store.dispatch('engine/enqueueAction', { 
          title: 'tryturn', selector: 'woffler/playerAction', payload, lock: true
        })

      },
      claimgreen() {},
      claimred() {},
      claimtake() {},
      untake() {},
      takelvl() {},
      unjail() {},
      nextlvl() {},
      unlocklvl(idlevel) {},
      switchbrnch(idbranch) {},
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
        retval.push(green ? "greenpos" : red ? "redpos" : "safepos")

        if (currentpos)
          retval.push("curpos")

        if (trypos && !currentpos) {
          retval.push("trypos")
          retval.push("jump")
        }

        return retval
      }
    }
  }
  function compareAssets(a,b) {

  }
</script>
<template>
  <div class="wflbox">
    <div v-for="idx in levelLength" :key="idx"
      :class="cellValueClasses(idx-1)"
      :style="cellPositionStyle(idx-1)"
    >{{ idx }}</div>
    <div class="panel levelpot">
      <span class="caption">Current pot:</span><br>
      <span class="asset">{{level.potbalance}}</span>
    </div>
    <div v-if="takeAmount" class="panel levelreward">
      <span class="caption">Reward:</span><br>
      <span class="asset">{{takeAmount}}</span>
    </div>
    <div v-if="level.next" class="panel nextlevel">
      <span class="caption">Next pot:</span><br>
      <span class="asset">{{level.next.potbalance}}</span><br>
      <div v-if="canUnlockNext" style="line-height: 10px">
        <v-btn fab class="unlocknextbtn"
          @click="unlocklvl(level.next.id)">unlock</v-btn>
        <span style="font-size: smaller">{{player.triesleft}} left</span>
      </div>
    </div>
    <div v-if="level.split" class="splitlevel">
      <span class="caption">Split pot:</span><br>
      <span class="asset">{{level.split.potbalance}}</span><br>
      <div v-if="canUnlockSplit" style="line-height: 10px">
        <v-btn fab class="unlocksplitbtn"
          @click="unlocklvl(level.split.id)">unlock split</v-btn><br>
        <span style="font-size: smaller">{{player.triesleft}} left</span>
      </div>
      <div v-else-if="canSwitchToSplit" style="line-height: 10px">
        <v-btn fab class="switchbrnchbtn"
          @click="switchbrnch(level.split.idbranch)">switch</v-btn><br>
        <span style="font-size: smaller">switch branch</span>
      </div>
    </div>
    <div v-if="level.previous" class="panel previouslevel">
      <span class="caption">Previous pot:</span><br>
      <span class="asset">{{level.previous.potbalance}}</span>
    </div>
    <div class="hud">
      <v-layout row justify-center align-center fill-height>
        <div flex v-if="canTry" class="buttonpanel">
          <v-btn color="primary" class="trybtn" fab
            @click="tryturn">try</v-btn>
          <br>
          <span class="caption">{{player.triesleft}} left</span>
        </div>
        <div flex v-if="canCommitTry" class="buttonpanel">
          <v-btn class="commitbtn" fab
            @click="committurn">turn</v-btn>
          <br>
          <span class="caption">commit turn</span>
        </div>
        <v-btn flex v-if="canNext" fab class="nextbtn"
          @click="nextlvl">next</v-btn>
        <v-btn flex v-if="canTake" fab class="takebtn"
          @click="takelvl">take</v-btn>
        <v-btn flex v-if="canUntake" fab class="untakebtn"
          @click="untake">un-take</v-btn>
        <v-btn flex v-if="canClaimRed" fab class="claimredbtn"
          @click="claimred">take</v-btn>
        <v-btn flex v-if="canUnjail" fab class="unjailbtn"
          @click="unjail">un-jail</v-btn>
        <v-btn flex v-if="canClaimGreen" fab class="claimgreenbtn"
          @click="claimgreen">to 0</v-btn>
      </v-layout>
    </div>
  </div>
</template>
<style scoped>
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
  .cell {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 2px dotted gray;
    line-height: 28px;
    border-radius: 15px;
    margin-left: -15px;
    margin-top: -15px
  }
  .safepos { border-color: gray }
  .greenpos { border-color: green }
  .redpos { border-color: red }
  .curpos { font-weight: bold }
  .curpos.safepos { background-color: gray; border: none}
  .curpos.redpos { background-color: red; border: none}
  .curpos.greenpos { background-color: green; border: none}
  .trypos { border-width: 3px; border-style: solid; font-weight: bold }
  .caption { font-size: smaller; color: gray }
  .asset { font-size: smaller; font-weight: bold }
  .panel {     
    border: 1px solid gray;
    border-radius: 20px;
    line-height: 16px;
  }
  .buttonpanel { 
    line-height: 10px
  }
  .levelpot {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 50%;
    margin-left: -50px;
    top: 50%;
    margin-top: -90px;
  }
  .levelreward {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 50%;
    margin-left: -50px;
    top: 50%;
    margin-top: 50px;
    border: 1px solid gray;
    border-radius: 20px;
  }
  .nextlevel {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 50%;
    margin-left: 50px;
    top: 50%;
    margin-top: -100px;
  }
  .splitlevel {
    position: absolute;
    width: 100px;
    height: 60px;
    left: 50%;
    margin-left: -100px;
    top: 50%;
    margin-top: -100px;
  }
  .previouslevel {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 50%;
    margin-left: 50px;
    top: 50%;
    margin-top: 50px;
  }
  .jump {
    -moz-animation: jump 0.3s infinite ease-in-out;
    -webkit-animation: jump 0.3s infinite ease-in-out;
  }

  @-moz-keyframes jump {
  0% { font-weight: bold; }
  50% { font-weight: normal; }
  100% { font-weight: bold; }
}

@-webkit-keyframes jump {
  0% { font-weight: bold; }
  50% { font-weight: normal; }
  100% { font-weight: bold; }
}


</style>



