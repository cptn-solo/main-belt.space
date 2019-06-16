<script>  
  import { commonActions } from '../../woffler/commonActions'
  import { AddStakeConfirm, CreateNewGamePrompt, ClosedBranchWarning } from '../../dialogs/wofflerConfirmations'
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
      showClosed(idx) {
        this.$dialog.warning(new ClosedBranchWarning())
      },
      unlockBranch(idx) {
        const level = this.startLevels[idx]
        const unlockAction = Object.assign(commonActions.unlockGameAction, { payload: level.id })
        unlockAction.success = this.unlockSuccess
        this.$store.dispatch('engine/enqueueAction', unlockAction)
      },
      joinGame(idx) {
        const level = this.startLevels[idx]
        const joinAction = Object.assign(commonActions.joinGameAction, { payload: level.idbranch })
        joinAction.success = this.joinSuccess
        this.$store.dispatch('engine/enqueueAction', joinAction)
      },
      joinSuccess() {
        this.$router.push({ path: "/woffler/active" })
      },
      unlockSuccess(info) {
        if (!info.locked) {
          const levelIdx = this.startLevels.findIndex(l => l.id === info.id)
          if (levelIdx >= 0) 
            this.joinGame(levelIdx)
        } else {
          this.$dialog.message.info(this.$t('wflNoluckUnlockMessage'))
        }
      },
      async createRootBranch() {
        if (await this.$dialog.confirm(new CreateNewGamePrompt()))
          this.$router.push({ path: "/woffler/metas" })
      },
      showActions(idx) {
        const payload = this.startLevels[idx]
        const actions = []
        if (this.loggedIn) {
          if (payload.locked === 1) {
            const unlockAction = Object.assign(commonActions.unlockGameAction, { payload: payload.id })
            unlockAction.success = this.unlockSuccess
            actions.push(unlockAction)
          } else if (this.hasIngameProfile) {
            const joinAction = Object.assign(commonActions.joinGameAction, { payload: payload.idbranch })
            joinAction.success = this.joinSuccess
            actions.push(joinAction)
          } else {
            const signAndJoin = Object.assign(commonActions.signupAdnJoinGameAction, { paylopayload: payload.idbranchad })
            signAndJoin.success = this.joinSuccess
            actions.push(signAndJoin)
          }

          const addStakeAction = Object.assign({}, commonActions.addStakeAction)
          const minStakeValue = utils.parseAmount(
            Math.max(
              (utils.assetAmount(payload.branch.potbalance) * payload.branch.meta.stkrate) / 100,
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
                <template v-if="level.locked">
                  <div flex>
                    <v-layout row justify-space-between align-baseline>
                      <span flex>{{$t('wflBranchStake')}}:</span>
                      <span flex>{{level.branch.totalstake}}</span>
                    </v-layout>
                  </div>
                  <div flex style="color: green"
                    v-if="!!level.branch.stake.stake">
                    <v-layout row justify-space-between align-baseline>
                      <span flex>{{$t('wflBranchOwnedStake')}}:</span>
                      <span flex>{{level.branch.stake.stake}}</span>
                    </v-layout>
                  </div>
                </template>
                <template v-else>
                  <div flex>
                    <v-layout row justify-space-between align-baseline>
                      <span flex>{{$t('wflBranchCurrentPot')}}:</span>
                      <span flex>{{level.branch.potbalance}}</span>
                    </v-layout>
                  </div>
                  <div flex>
                    <v-layout row justify-space-between align-baseline>
                      <span flex>{{$t('wflBranchRevenue')}}:</span>
                      <span flex>{{level.branch.totalrvnue}}</span>
                    </v-layout>
                  </div>            
                </template>
              </v-layout>            
            </v-layout>            
          </div>
          <div flex>
            <v-layout row>
              <v-btn flex icon v-if="level.branch.closed" 
                class="actionbtn"
                @click.stop="showClosed(idx)">
                <v-icon color="warning">highlight_off</v-icon>
              </v-btn>
              <v-btn flex icon ripple v-else-if="level.locked" 
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