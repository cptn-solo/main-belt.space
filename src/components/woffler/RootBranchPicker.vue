<script>  
  import { commonActions } from '../../woffler/commonActions'
  import { AddStakeConfirm } from '../../dialogs/wofflerConfirmations'
  import AssetPanel from './AssetPanel'
  
  export default {    
    props: {
      startLevels: {
        type: Array,
        default: () => ([])
      },
      hasIngameProfile: {
        type: Boolean,
        default: false
      }
    },
    components: {
      AssetPanel
    },
    methods: {
      showMeta(idx) {
        this.$store.dispatch('gui/showDialog', { key: "levelInfoDialog", payload: this.startLevels[idx] })          
      },
      createRootBranch() {
        this.$dialog.message.info('coming soon')
      },
      showActions(idx) {
        const payload = this.startLevels[idx]
        if (payload.locked) 
          this.showlockedactions(payload) 
        else 
        this.showlvlactions(payload)
      },
      showlockedactions(payload) {
        const actions = []
        if (this.hasIngameProfile)
          actions.push(Object.assign(commonActions.unlockGameAction, { payload: payload.id }))

        const addStakeAction = Object.assign({}, commonActions.addStakeAction)
        addStakeAction.payload = { level: payload }
        addStakeAction.confirm = new AddStakeConfirm([payload.idbranch])
        actions.push(Object.assign(commonActions.addStakeDialogAction, { payload: { key: "stakeDialog", payload: addStakeAction }}))
        
        actions.push(Object.assign(commonActions.showRulesAction, { payload: { key: "levelInfoDialog", payload } }))

        this.$store.dispatch('engine/requestActions', actions)
      },
      showlvlactions(payload) {
        const actions = []
        if (this.hasIngameProfile)
          actions.push(Object.assign(commonActions.startGameAction, { payload: payload.idbranch }))
        else if (this.loggedIn)
          actions.push(Object.assign(commonActions.signupAdnJoinGameAction, { payload }))

        actions.push(Object.assign(commonActions.showRulesAction, { payload: { key: "levelInfoDialog", payload} }))

        this.$store.dispatch('engine/requestActions', actions)
      },
    }
  }
</script>
<template>
  <v-list dense three-line>
    <v-list-tile v-for="(level, idx) in startLevels"      
      :key="idx"
      @click="showActions(idx)"
      ripple> 
      <v-list-tile-avatar v-if="level.locked"><v-icon>lock</v-icon></v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          <span>#{{level.branch.id}}</span>&nbsp;<span>{{level.branch.meta.name}}</span>          
        </v-list-tile-title>
        <v-list-tile-sub-title>
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
            <v-layout px-1
              flex column justify-start align-left shrink>
              <v-chip flex v-if="level.branch.meta.startjailed" 
                class="bage" color="warning">{{$t('wflPaidStartBage')}}</v-chip>
            </v-layout>            
          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon ripple @click.stop="showMeta(idx)">
          <v-icon small>info</v-icon>
        </v-btn>        
      </v-list-tile-action>
    </v-list-tile>
    <v-divider v-if="startLevels.length > 0"/>
    <v-btn style="margin: 20px 0 20px 0"
      @click="createRootBranch">
      <v-icon ripple mr-2>add</v-icon>
      create your own game!
    </v-btn>
    <AssetPanel guiKey="stakeDialog" 
      :placeholder="$t('upAddStakeAmountPH')">
      <template #title>{{$t('upAddStake')}}</template>
    </AssetPanel>
  </v-list>
</template>
<style scoped>
.bage {
  height: 16px;font-weight: bolder; font-size: smaller
}
</style>