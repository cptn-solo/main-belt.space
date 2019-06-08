<script>
import { UserProfileForgetKeyConfirm } from '../../dialogs/userProfileConfirmations'
import Countdown from '../controls/Countdown'

export default {
  props: {
    player: {
      type: Object,
      default: null
    },
    showVesting: { type: Boolean, default: false},
    vestingReady: { type: Boolean, default: false},
    vestingDate: { type: Number, default: 0}
  },
  components: {
    Countdown
  },
  methods: {
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
  }
  
}
</script>

<template>
  <v-menu>
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
</template>
