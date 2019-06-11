<script>  
  import { commonActions } from '../../woffler/commonActions'
  import { AddStakeConfirm } from '../../dialogs/wofflerConfirmations'
  import AssetPanel from './AssetPanel'
import utils from '../../utils';
  
  export default {    
    props: {
      startLevels: {
        type: Array, default: () => ([])
      },
      hasIngameProfile: {
        type: Boolean, default: false
      },
      player: {
        type: Object, default: null
      }
    },
    components: {
      AssetPanel
    },
    computed: {
      loggedIn() {
        return !!this.player.account
      }
    },
    methods: {
      showMeta(idx) {
        this.$store.dispatch('gui/showDialog', { key: "levelInfoDialog", payload: this.startLevels[idx] })          
      },
      unlockBranch(idx) {
        const level = this.startLevels[idx]
        this.$store.dispatch('engine/enqueueAction', Object.assign(commonActions.unlockGameAction, { payload: level.id }))
      },
      joinGame(idx) {
        const level = this.startLevels[idx]
        this.$store.dispatch('engine/enqueueAction', Object.assign(commonActions.joinGameAction, { payload: level.idbranch }))
      },
      createRootBranch() {
        this.$dialog.message.info('coming soon')
      },
      showActions(idx) {
        const payload = this.startLevels[idx]
        const actions = []
        if (this.loggedIn) {
          if (payload.locked === 1)
            actions.push(Object.assign(commonActions.unlockGameAction, { payload: payload.id }))
          else if (this.hasIngameProfile)
            actions.push(Object.assign(commonActions.joinGameAction, { payload: payload.idbranch }))
          else 
            actions.push(Object.assign(commonActions.signupAdnJoinGameAction, { payload }))

          const addStakeAction = Object.assign({}, commonActions.addStakeAction)
          const minStakeValue = utils.parseAmount(
            Math.max(
              (utils.assetAmount(payload.potbalance) * payload.branch.meta.stkrate) / 100,
              utils.assetAmount(payload.branch.meta.stkmin)
            )
          )
          const maxPayment = utils.assetAmount(this.player.activebalance)
          addStakeAction.payload = { level: payload }
          addStakeAction.confirm = new AddStakeConfirm([payload.idbranch])
          actions.push(Object.assign(commonActions.addStakeDialogAction, { 
            payload: { key: "stakeDialog", payload: addStakeAction, props: { min: minStakeValue, max: maxPayment } }}))
        }
                
        actions.push(Object.assign(commonActions.showRulesAction, { payload: { key: "levelInfoDialog", payload } }))
        this.$store.dispatch('engine/requestActions', actions)
      },
    }
  }
</script>
<template>
  <v-layout column>
    <v-card v-for="(level, idx) in startLevels" style="margin:2px"
      :key="idx"
      @click="showActions(idx)"> 
      <v-card-text>
        <div style="text-align: left">
          <v-layout row justify-space-between align-start>
            <div flex>
              <span class="mtitle">#{{level.branch.id}}:&nbsp;{{level.branch.meta.name}}</span>
              <v-chip v-if="level.branch.meta.startjailed" class="bage" style="margin-left: 5px" color="warning">{{$t('wflPaidStartBage')}}</v-chip>
            </div>                                  
          </v-layout>          
        </div>
        <v-layout row justify-space-between>
          <div style="margin-top: 5px">
            <v-layout row justify-start align-center>
              <v-layout flex column justify-start align-right style="text-align: right; line-height: 15px">
                <div flex>
                  <span flex>{{$t('wflBranchStake')}}:</span>&nbsp;
                  <span flex>{{level.branch.totalstake}}</span>
                </div>
                <div v-if="!!level.branch.stake.stake"
                  flex column justify-start align-right
                  style="color: green">
                  <span flex>{{$t('wflBranchOwnedStake')}}:</span>&nbsp;
                  <span flex>{{level.branch.stake.stake}}</span>
                </div>
                <div v-if="!level.locked"
                  flex column justify-start align-right style="text-align: right">
                  <span flex>{{$t('wflBranchRevenue')}}:</span>&nbsp;
                  <span flex>{{level.branch.totalrvnue}}</span>
                </div>            
              </v-layout>            
            </v-layout>            
          </div>
          <div flex>
            <v-layout row>
              <v-btn flex icon ripple v-if="level.locked" 
                class="actionbtn"
                @click.stop="unlockBranch(idx)">
                <v-icon color="primary">lock</v-icon>
              </v-btn> 
              <v-btn flex icon ripple v-else-if="!level.locked && loggedIn"
                class="actionbtn"
                @click.stop="joinGame(idx)">
                <v-icon color="primary">play_circle_filled</v-icon>
              </v-btn>
              <v-btn flex icon ripple 
                class="actionbtn"
                @click.stop="showMeta(idx)">
                <v-icon>info</v-icon>
              </v-btn>              
            </v-layout>
          </div>
        </v-layout>
      </v-card-text>      
    </v-card>
    <v-btn style="margin: 20px 0 20px 0"
      @click="createRootBranch">
      <v-icon ripple mr-2>add</v-icon>
      create your own game!
    </v-btn>
    <AssetPanel guiKey="stakeDialog" 
      :placeholder="$t('upAddStakeAmountPH')">
      <template #title>{{$t('upAddStake')}}</template>
    </AssetPanel>
  </v-layout>
</template>
<style scoped>
.bage {
  height: 16px;font-weight: bolder; font-size: smaller
}
.mtitle {
  font-weight: bold; line-height: 14px;
  margin-bottom: 4px;
}
.actionbtn {
  width: 20px; 
  height: 20px; 
  margin-top: -5px;
}

</style>