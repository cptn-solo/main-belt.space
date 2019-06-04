<script>
import * as constants from '../../state/constants'
import ApplicationError from '../../dialogs/applicationError'
import { UserProfileForgetKeyConfirm, UserProfileDepositConfirm, UserProfileWithdrawConfirm } from '../../dialogs/userProfileConfirmations'
import utils from '../../utils'
import Countdown from '../controls/Countdown'

let interval = null

export default {
  props: {
    player: {
      type: Object,
      default: null
    },
    status: {
      type: Number,
      default: constants.PROFILE_UNKNOWN
    }
  },
  components: {
    Countdown
  },
  data: () => ({
    constants,
    depositDialog: false,
    depositAmount: null,
    withdrawDialog: false,
    withdrawAmount: null,
    amountRules: [
      value => {
        const pattern = /^[0-9]{1,10}(\.[0-9]{1,4})?$/
        return pattern.test(value) || 'invalid amount'
      },
    ]
  }),
  computed: {
    showVesting() {
      return this.player && this.player.levelresult === 4 ? (utils.assetAmount(this.player.vestingbalance) > 0) : false
    },
    vestingDate() {
      return this.player && this.showVesting ? this.player.resulttimestamp*1000 : null
    },
    vestingReady() {
      return this.player && this.showVesting && this.player.resulttimestamp*1000 < Date.now()
    }
  },
  created() {
    this.initVestingInterval()
  },
  destroyed() {
    if (interval)
      clearInterval(interval)
  },
  watch: {
    vestingDate(n, o) {
      if (!n) 
        this.clearVestingInterval()
      else 
        this.initVestingInterval()
    }
  },
  methods: {
    clearVestingInterval() {
      console.log('clearVestingInterval')
      try {
        clearInterval(interval)
      } catch (ex) {
        console.log('catch clearVestingInterval', ex)
      }
    },
    initVestingInterval() {
      const now = Date.now()
      const vesting = this.vestingDate
      if (vesting && vesting > now) {
        const diff = vesting - now
        console.log('initVestingInterval', diff)      
        interval = setInterval(() => {
          this.vestingDateReached()  
        }, diff)
      } else {
        this.clearVestingInterval()
      }
    },
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
    deposit () {
      //from, to, amount, memo
      const amount = utils.parseAmount(this.depositAmount)
      if (amount > 0) {
        const payload = utils.asset(amount)
        this.$store.dispatch('engine/enqueueAction', {
          title: 'deposit', selector: 'userProfile/depositAsset', payload,
          lock: true, confirm: new UserProfileDepositConfirm(constants.CURR_CODE, payload, constants.APP_CODE)
        })
        this.depositDialog = false
      }
    },
    withdraw () {
      //from, to, amount, memo
      const amount = utils.parseAmount(this.withdrawAmount)
      if (amount > 0) {
        const payload = utils.asset(amount)
        this.$store.dispatch('engine/enqueueAction', {
          title: 'withdraw', selector: 'userProfile/withdrawAsset', payload,
          lock: true, confirm: new UserProfileWithdrawConfirm(constants.CURR_CODE, payload, this.player.account)
        })
        this.withdrawDialog = false
      }
    },
    vestingDateReached() {
      this.$store.dispatch('engine/enqueueAction', {
        title: 'reloadprofile', 
        selector: 'userProfile/loadAndProcessIngameProfile'        
      })
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
                <v-list-tile-action><v-icon>save_alt</v-icon></v-list-tile-action>
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
              <v-list-tile @click="depositDialog = true">
                <v-list-tile-action><v-icon>add</v-icon></v-list-tile-action>
                <v-list-tile-title>{{$t('upDeposit')}}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="withdrawDialog = true">
                <v-list-tile-action><v-icon>remove</v-icon></v-list-tile-action>
                <v-list-tile-title>{{$t('upWithdraw')}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-dialog v-model="depositDialog" max-width="300px">
      <v-card>
        <v-card-title>{{$t('upDeposit')}}</v-card-title>
        <v-divider/>
        <v-card-text>
          <VTextField
            style="width: 100%"
            v-model="depositAmount"
            name="depositAmount"
            :rules="amountRules"
            :placeholder="$t('upDepositAmountPH')"
            :suffix="constants.CURR_CODE"
          />
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer />
          <v-btn small outline
            @click="depositDialog = false">{{$t('miskCacel')}}</v-btn>
          <v-btn small color="primary"
            @click="deposit">{{$t('miskProceed')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="withdrawDialog" max-width="300px">
      <v-card>
        <v-card-title>{{$t('upWithdraw')}}</v-card-title>
        <v-divider/>
        <v-card-text>
          <VTextField
            style="width: 100%"
            v-model="withdrawAmount"
            name="withdrawAmount"
            :rules="amountRules"
            :placeholder="$t('upWithdrawAmountPH')"
            :suffix="constants.CURR_CODE"
          />
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer />
          <v-btn small outline
            @click="withdrawDialog = false">{{$t('miskCacel')}}</v-btn>
          <v-btn small color="primary"
            @click="withdraw">{{$t('miskProceed')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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


