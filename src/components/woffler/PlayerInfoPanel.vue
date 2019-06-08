<script>
import * as constants from '../../state/constants'
import PlayerProfileMenu from './PlayerProfileMenu'
import PlayerBalanceMenu from './PlayerBalanceMenu'
import AssetPanel from './AssetPanel'

export default {
  props: {
    player: {
      type: Object,
      default: null
    },
    status: {
      type: Number,
      default: constants.PROFILE_UNKNOWN
    },
    showVesting: { type: Boolean, default: false},
    vestingReady: { type: Boolean, default: false},
    vestingDate: { type: Number, default: 0}
  },
  components: {
    PlayerProfileMenu, PlayerBalanceMenu, AssetPanel
  },
  data: () => ({
    constants,
  }),
  methods: {
    signup() {
      this.$store.dispatch('engine/enqueueAction', {
        title: 'signup', selector: 'userProfile/signup',
        lock: true, payload: null
      })
    },
  }
}
</script>
<template>
  <v-container pa-0>
    <v-layout row justify-space-between align-center fill-height>
      <v-flex xs1>
        <v-layout row justify-start align-center fill-height>
          <v-btn v-if="status === constants.PROFILE_LOGGEDIN"
            flex icon ripple
            style="margin-left: -7px"
            @click="signup"><v-icon>person_add</v-icon></v-btn>
          <PlayerProfileMenu v-if="status === constants.PROFILE_INITIALIZED" 
            :player="player"
            :showVesting="showVesting"
            :vestingReady="vestingReady"
            :vestingDate="vestingDate"
            />
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout
          style="line-height: 16px;"
          column align-end>
          <template v-if="status === constants.PROFILE_INITIALIZED">
            <v-flex>
              <v-layout row justify-end align-center fill-height>
                <span class="caption">{{$t('upBalance')}}:</span>&nbsp;
                <span class="asset">{{player.activebalance}}</span>
              </v-layout>
            </v-flex>
            <v-flex v-if="showVesting">
              <v-layout row justify-end align-center fill-height>
                <span class="caption">{{$t('upVesting')}}:</span>&nbsp;
                <span :class="vestingReady ? 'asset' : 'caption'">{{player.vestingbalance}}</span>
              </v-layout>
            </v-flex>
          </template>
          <span flex v-else>{{$t('upProfileNotInit')}}</span>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout row justify-end align-center fill-height>
          <PlayerBalanceMenu :player="player"/>
        </v-layout>
      </v-flex>
    </v-layout>
    <AssetPanel guiKey="depositDialog" 
      :placeholder="$t('upDepositAmountPH')">
      <template #title>{{$t('upDeposit')}}</template>
    </AssetPanel>
    <AssetPanel guiKey="withdrawDialog" 
      :placeholder="$t('upWithdrawAmountPH')">
      <template #title>{{$t('upWithdraw')}}</template>
    </AssetPanel>
  </v-container>
</template>
<style scoped>
.caption {
  font-size: smaller;
  color: gray
}
.asset {
  font-weight: bolder
}
</style>


