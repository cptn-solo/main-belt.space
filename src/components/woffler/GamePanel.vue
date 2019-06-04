<script>
  import utils from '../../utils'
  import ActionBtn from './ActionButton'

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
    components: {
      ActionBtn
    },
    data: () => ({
      showMenu: false,
      levelLength: LEVEL_LENGTH,
      actions: [
        /*  0 */{ key: "unlocknext", name: "unlocklvl" },
        /*  1 */{ key: "unlocksplit", name: "unlocklvl" },
        /*  2 */{ key: "switchbrnch" },
        /*  3 */{ key: "tryturn" },
        /*  4 */{ key: "committurn" },
        /*  5 */{ key: "nextlvl" },
        /*  6 */{ key: "takelvl" },
        /*  7 */{ key: "untake" },
        /*  8 */{ key: "claimred" },
        /*  9 */{ key: "unjail" },
        /* 10 */{ key: "claimgreen" },
      ]
    }),
    computed: {
      loading() {
        return !!this.$store.state.engine.currentGUIAction
      },
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
      canGoNext() {
        return this.player.levelresult === PALYER_STATE.GREEN
          && (this.level.next && !this.level.next.locked)        
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

        if (trypos) {
          retval.push("jump")
          if (!currentpos)
            retval.push("trypos")
        }
        return retval
      }
    }
  }
</script>
<template>
  <div class="wflbox">
    <div v-for="idx in levelLength" :key="idx"
      :class="cellValueClasses(idx-1)"
      :style="cellPositionStyle(idx-1)"
    >{{ idx-1 }}</div>
    <div class="panel levelpot">
      <span class="caption">Current pot:</span><br>
      <span class="asset">{{level.potbalance}}</span>
    </div>
    <div v-if="takeAmount" class="panel levelreward">
      <span class="caption">Reward:</span><br>
      <span class="asset">{{takeAmount}}</span>
    </div>
    <div v-if="level.next" class="panel nextlevel">
      <v-layout column justify-start align-end fill-height>
        <span flex class="caption">Next pot:</span>
        <span flex class="asset">{{level.next.potbalance}}</span>
        <ActionBtn flex v-if="canUnlockNext" icon="lock" :action="actions[0]" 
          :payload="{ owner: this.player.account, idlevel: level.next.id }">
          <template #caption>{{player.triesleft+" left"}}</template>
        </ActionBtn>
        <ActionBtn flex v-else-if="canGoNext" icon="lock_open" :action="actions[5]">
          <template #caption>next</template>
        </ActionBtn>
      </v-layout>
    </div>
    <div v-if="level.split" class="splitlevel">
      <span class="caption">Split pot:</span><br>
      <span class="asset">{{level.split.potbalance}}</span><br>
      <ActionBtn v-if="canUnlockSplit" :action="actions[1]" :payload="{ idlevel: level.split.id }">
        <template #text>unlock</template>
        <template #caption>{{player.triesleft+" left"}}</template>
      </ActionBtn>
      <ActionBtn v-else-if="canSwitchToSplit" :action="actions[2]" :payload="{ idbranch: level.split.idbranch }">
        <template #text>switch</template>
        <template #caption>switch branch</template>
      </ActionBtn>
    </div>
    <div v-if="level.previous" class="panel previouslevel">
      <span class="caption">Previous pot:</span><br>
      <span class="asset">{{level.previous.potbalance}}</span>
    </div>
    <div class="hud">
      <v-layout row justify-center align-center fill-height>
        <ActionBtn v-if="canTry" :action="actions[3]">
          <template #text>try</template>
          <template #caption>{{player.triesleft+" left"}}</template>
        </ActionBtn>
        <ActionBtn v-if="canCommitTry" :action="actions[4]">
          <template #text>turn</template>
          <template #caption>commit turn</template>
        </ActionBtn>
        <ActionBtn v-if="canNext" :action="actions[5]">
          <template #text>next</template>
          <template #caption>next level</template>
        </ActionBtn>
        <ActionBtn v-if="canTake" :action="actions[6]">
          <template #text>take</template>
          <template #caption>take reward</template>
        </ActionBtn>
        <ActionBtn v-if="canUntake" :action="actions[7]">
          <template #text>un-take</template>
          <template #caption>return reward</template>
        </ActionBtn>
        <ActionBtn v-if="canClaimRed" :action="actions[8]">
          <template #text>{{level.idparent ? 'prev' : 'to 0'}}</template>
          <template #caption>{{level.idparent ? 'to prev. lvl' : 'restart lvl'}}</template>
        </ActionBtn>
        <ActionBtn v-if="canUnjail" :action="actions[9]">
          <template #text>un-jail</template>
          <template #caption>pay to stay</template>
        </ActionBtn>
        <ActionBtn v-if="canClaimGreen" :action="actions[10]">
          <template #text>to 0</template>
          <template #caption>restart lvl</template>
        </ActionBtn>
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
    margin-top: -55px;
    border: none;
  }
  .cell {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 2px dotted gray;
    line-height: 30px;
    vertical-align: middle;
    text-align: center;
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
  .asset { font-size: smaller; font-weight: bold }
  .caption { font-size: smaller; color: gray }
  .panel {
    border: 1px solid gray;
    border-radius: 20px;
    line-height: 16px;
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
    margin-top: -175px;
    padding: 5px    
  }
  .panel.nextlevel {
    border: none
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
    margin-top: 135px;
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



