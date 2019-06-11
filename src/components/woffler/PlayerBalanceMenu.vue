<script>
import { UserProfileDepositConfirm, UserProfileWithdrawConfirm } from '../../dialogs/userProfileConfirmations'
import * as constants from '../../state/constants'
import utils from '../../utils'

export default {
  props: {
    player: {
      type: Object, default: null
    },
    balance: {
      type: String, default: null
    }
  },
  data: () => ({
    constants,
  }),

  methods: {
    depositDialog() {
      this.$store.dispatch('gui/showDialog', { key: "depositDialog", payload: { 
        title: 'deposit', selector: 'userProfile/depositAsset', 
        lock: true, confirm: new UserProfileDepositConfirm([constants.APP_CODE])
      }, props: {
        max: utils.assetAmount(this.balance)
      } })
    },
    withdrawDialog() {
      this.$store.dispatch('gui/showDialog', { key: "withdrawDialog", payload: { 
        title: 'withdraw', selector: 'userProfile/withdrawAsset', 
        lock: true, confirm: new UserProfileWithdrawConfirm([this.player.account])
      }, props: {
        max: utils.assetAmount(this.player.activebalance)
      } })
    },
  }  
}
</script>

<template>
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
</template>
