<script>
  import utils from '../../../utils'
  import ActionBtn from './ActionButton'
  import Countdown from '../../controls/Countdown'
  import { WflVestingInfo } from '../../../dialogs/wofflerConfirmations'

  const LEVEL_LENGTH = 16

  export default {
    props: {
      player: {
        type: Object,
        default: null
      },
      level: {
        type: Object,
        default: null
      },
      showVesting: { type: Boolean, default: false},
      vestingReady: { type: Boolean, default: false},
      vestingDate: { type: Number, default: 0}
    },
    components: {
      ActionBtn, Countdown
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
        /* 10 */{ key: "claimsafe" },
        /* 11 */{ key: "claimtake" },
        /* 12 */{ key: "vestingwarning", info: new WflVestingInfo() },
        /* 13 */{ key: "splitlvl" },
        /* 14 */{ key: "buytries" },
      ]
    }),
    computed: {
      loading() {
        return !!this.$store.state.engine.currentGUIAction
      },
      canClaimTake() {
        return this.showVesting && this.vestingReady
      },
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
        const pathPos = 
          this.player.tryposition === this.player.currentposition ? 
            idx === this.player.tryposition  :
          this.player.tryposition > this.player.currentposition ? 
            idx > this.player.currentposition && idx <= this.player.tryposition :
            (idx > this.player.currentposition && idx < LEVEL_LENGTH ||
             idx <= this.player.tryposition && idx >= 0)

        let retval = ["cell"]
        retval.push(green ? "greenpos" : red ? "redpos" : "safepos")

        if (currentpos)
          retval.push("curpos")

        if (trypos) {
          retval.push("jump")
          if (!currentpos)
            retval.push("trypos")
        }

        if (pathPos)
          retval.push("pathpos")

        return retval
      }
    }
  }
</script>
<template>
  <div class="wflbox" v-if="level">
    <div v-for="idx in levelLength" :key="idx"
      :class="cellValueClasses(idx-1)"
      :style="cellPositionStyle(idx-1)"
    >{{ idx-1 }}</div>
    <div class="panel levelpot">
      <span class="caption">Current pot:</span><br>
      <span class="asset">{{level.amounts.currentPot}}</span>
    </div>
    <div v-if="level.amounts.takeAmount" class="panel levelreward">
      <span class="caption">Reward:</span><br>
      <span class="asset">{{level.amounts.takeAmount}}</span>
    </div>
    <div v-if="level.previous" class="panel previouslevel">
      <span class="caption">Previous pot:</span><br>
      <span class="asset">{{level.amounts.prevPot}}</span>
    </div>
    <div class="hud">
      <v-layout row justify-center align-center fill-height>
        <ActionBtn v-if="level.permissions.canTry" :action="actions[3]" 
          :color="player.triesleft > 2 ? 'primary' : player.triesleft > 1 ? null : 'warning'">
          <template #text>try</template>
          <template #caption>{{player.triesleft+" left"}}</template>
        </ActionBtn>
        <ActionBtn v-if="level.permissions.canCommitTry" :action="actions[4]">
          <template #text>turn</template>
          <template #caption>commit turn</template>
        </ActionBtn>
        <ActionBtn v-if="canClaimTake" 
          :panel="true"
          color="primary"
          :action="actions[11]">
          <template #text>claim</template>
          <template #caption>claim vested:<br>{{player.vestingbalance}}</template>
        </ActionBtn>
        <ActionBtn v-if="showVesting && !canClaimTake" :action="actions[12]">
          <template #text><Countdown :end="vestingDate"/></template>
          <template #caption>vesting lock</template>
        </ActionBtn>
        <ActionBtn v-if="level.permissions.canClaimSafe" 
          :panel="true"
          :action="actions[10]">
          <template #text>restart lvl</template>
          <template #caption>restart current level</template>
        </ActionBtn>
      </v-layout>
    </div>
    <div v-if="level.next" class="panel nextlevel">
      <v-layout column justify-start align-end fill-height>
        <span flex class="caption">Next pot:</span>
        <span flex class="asset">{{level.amounts.nextPot}}</span>
        <ActionBtn flex v-if="level.permissions.canUnlockNext" icon="lock" :action="actions[0]" 
          :payload="{ account: this.player.account, idlevel: level.next.id }">
          <template #caption>{{player.triesleft+" left"}}</template>
        </ActionBtn>
        <ActionBtn flex v-else-if="level.permissions.canGoNext" icon="lock_open" :action="actions[5]">
          <template #caption>next</template>
        </ActionBtn>
      </v-layout>
    </div>
    <ActionBtn v-if="level.permissions.canNext && !level.next" 
      :panel="true"
      :action="actions[5]">
      <template #text>next</template>
      <template #caption>next level will get {{level.amounts.nextPotCandidate}}</template>
    </ActionBtn>
    <ActionBtn flex v-else-if="level.permissions.canNext" 
      :panel="true"
      :action="actions[5]">
      <template #text>unlock</template>
      <template #caption>try to unlock {{level.amounts.nextPot}}</template>
    </ActionBtn>
    <div v-if="level.split" class="panel splitlevel">
      <v-layout column justify-start align-start fill-height>
        <span flex class="caption">Split pot:</span>
        <span flex class="asset">{{level.amounts.splitPot}}</span>
        <ActionBtn flex v-if="level.permissions.canUnlockSplit" icon="lock" :action="actions[1]" 
          :payload="{ account: this.player.account, idlevel: level.split.id }">          
          <template #caption>{{player.triesleft+" left"}}</template>
        </ActionBtn>
        <ActionBtn flex v-else-if="level.permissions.canSwitchToSplit" icon="lock_open" :action="actions[2]" 
          :payload="{ account: this.player.account, idbranch: level.split.idbranch }">          
          <template #caption>switch</template>
        </ActionBtn>
      </v-layout>
    </div>
    <ActionBtn v-if="level.permissions.canSplit && !level.split" 
      :panel="true"
      :action="actions[13]">
      <template #text>split</template>
      <template #caption>split level will get {{level.amounts.splitPotCandidate}}</template>
    </ActionBtn>
    <ActionBtn flex v-else-if="level.permissions.canSplit" 
      :panel="true"
      :action="actions[5]">
      <template #text>unlock</template>
      <template #caption>try to unlock {{level.amounts.splitPot}}</template>
    </ActionBtn>
    <ActionBtn flex v-else-if="level.permissions.canBuyTries" 
      :panel="true"
      :action="actions[14]">
      <template #text>buy retries</template>
      <template #caption>buy additional 3 tries for {{level.amounts.buyTryAmount}}</template>
    </ActionBtn>
    <ActionBtn v-if="level.permissions.canTake" 
      :panel="true"
      :action="actions[6]">
      <template #text>take</template>
      <template #caption>receive {{level.amounts.takeAmount}} to vesting balance<div class="takewarning">blocks progress!</div></template>
    </ActionBtn>
    <ActionBtn v-if="level.permissions.canUntake" 
      :panel="true"
      :action="actions[7]">
      <template #text>un-take</template>
      <template #caption>return reward to continue</template>
    </ActionBtn>
    <ActionBtn v-if="level.permissions.canClaimRed" 
      :panel="true"
      :action="actions[8]">
      <template #text v-if="level.idparent">return</template>
      <template #text v-else>restart</template>
      <template #caption v-if="level.idparent">go to previous level</template>
      <template #caption v-else>go to 0 cell in current level</template>
    </ActionBtn>
    <ActionBtn v-if="level.permissions.canUnjail" 
      :panel="true"
      :action="actions[9]">
      <template #text>un-jail</template>
      <template #caption>pay {{level.amounts.unjailAmount}} to stay on the current level</template>
    </ActionBtn>
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
  .pathpos { box-shadow: inset 0px 0px 5px 2px #bdbdbd; }
  .curpos.safepos { background-color: gray; border: none}
  .curpos.redpos { background-color: red; border: none}
  .curpos.greenpos { background-color: green; border: none}
  .trypos { border-width: 3px; border-style: solid; font-weight: bold }
  .asset { font-size: smaller; font-weight: bold }
  .caption { font-size: smaller; color: gray }
  .panel {
    border: 1px solid gray;
    border-radius: 5px;
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
  .buttonpanel.takelvl {
    margin-left: -75px;
    margin-top: 85px;
    width: 150px;
    background-color:purple;
  }  

  .buttonpanel {
    position: absolute;
    width: 120px;
    left: 50%;
    top: 50%;
    padding: 5px;
    border: 1px solid gray;
    border-radius: 10px;    
  }
  .nextlevel {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 50%;
    margin-left: 50px;
    top: 50%;
    margin-top: -175px;
    padding: 5px;
  }
  .buttonpanel.nextlvl {
    margin-left: 30px;
    margin-top: -155px;
    background-color: green;
  }
  .splitlevel {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 50%;
    margin-left: -150px;
    top: 50%;
    margin-top: -175px;
    padding: 5px; 
  }
  .buttonpanel.splitlvl {
    margin-left: -150px;
    margin-top: -155px;
    background-color: green;
  }
  .buttonpanel.buytries {
    margin-left: -60px;
    margin-top: -155px;
    background-color: maroon;
  }
  .buttonpanel.claimred {
    margin-left: -150px;
    margin-top: 105px;
    background-color:orangered;
  }
  .buttonpanel.claimsafe {
    margin-left: -60px;
    margin-top: -40px;
    background-color:olive;
  }
  .buttonpanel.claimtake {
    margin-left: -60px;
    margin-top: -40px;    
  }
  .buttonpanel.unjail {
    margin-left: -60px;
    margin-top: -40px;
    background-color: maroon;
  }
  .buttonpanel.untake {
    margin-left: -60px;
    margin-top: 85px;
    background-color: green;
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
  .takewarning {
    background-color:yellow; font-weight: bold; margin-top: 3px; color: black; border-radius: 3px; padding: 0 3px 0 3px;
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



