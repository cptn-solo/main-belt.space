<script>
import * as constants from '../../state/constants'
import ApplicationError from '../../dialogs/applicationError'
import { UserProfileForgetKeyConfirm, UserProfileDepositConfirm, UserProfileWithdrawConfirm } from '../../dialogs/userProfileConfirmations'
import utils from '../../utils'
import Countdown from '../controls/Countdown'
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
    Countdown, AssetPanel
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
    forget() {
      this.$store.dispatch('engine/enqueueAction', {
        title: 'forget', selector: 'userProfile/forget',
        lock: true, payload: null,
        confirm: new UserProfileForgetKeyConfirm()
      })
    },
    claimtake() {
      this.$store.dispatch('engine/enqueueAction', {
        title: 'deposit', selector: 'woffler/playerAction',
        lock: true, payload: { actionname: 'claimtake' }
      })
    },
    depositDialog() {
      this.$store.dispatch('gui/showDialog', { key: "depositDialog", payload: { 
        title: 'deposit', selector: 'userProfile/depositAsset', 
        lock: true, confirm: new UserProfileDepositConfirm([constants.APP_CODE])
      } })
    },
    withdrawDialog() {
      this.$store.dispatch('gui/showDialog', { key: "withdrawDialog", payload: { 
        title: 'withdraw', selector: 'userProfile/withdrawAsset', 
        lock: true, confirm: new UserProfileWithdrawConfirm([this.player.account])
      } })
    }
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
          <v-menu v-if="status === constants.PROFILE_INITIALIZED">
            <template slot="activator">
              <v-icon ripple>person_outline</v-icon>
            </template>
            <v-list dense>
              <v-list-tile v-if="showVesting" :disabled="!vestingReady"
                @click="claimtake">
                <v-list-tile-action><v-icon :disabled="!vestingReady">save_alt</v-icon></v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{$t('wflClaimTake')}}</v-list-tile-title>
                  <v-list-tile-sub-title v-if="!vestingReady">
                    <Countdown :end="vestingDate" />
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title v-else>{{player.vestingbalance}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="forget">
                <v-list-tile-action><v-icon color="warning">remove_circle</v-icon></v-list-tile-action>
                <v-list-tile-title>{{$t('upForget')}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
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
          <v-menu>
            <template slot="activator">
              <v-icon ripple>monetization_on</v-icon>
            </template>
            <v-list dense>
              <v-list-tile @click="depositDialog">
                <v-list-tile-action><v-icon>add</v-icon></v-list-tile-action>
                <v-list-tile-title>{{$t('upDeposit')}}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="withdrawDialog">
                <v-list-tile-action><v-icon>remove</v-icon></v-list-tile-action>
                <v-list-tile-title>{{$t('upWithdraw')}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
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


