<script>
import * as constants from '../../state/constants'
import ApplicationError from '../../dialogs/applicationError'
import { UserProfileForgetKeyConfirm, UserProfileDepositConfirm, UserProfileWithdrawConfirm } from '../../dialogs/userProfileConfirmations'
import utils from '../../utils'

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
  methods: {
    async signup() {
      this.$store.dispatch('engine/enqueueAction', { 
        title: 'signup', selector: 'userProfile/signup', 
        lock: true, payload: null
      })
    },
    async forget() {
      this.$store.dispatch('engine/enqueueAction', { 
        title: 'forget', selector: 'userProfile/forget', 
        lock: true, payload: null,
        confirm: new UserProfileForgetKeyConfirm()
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
          column align-end>
          <template v-if="status === constants.PROFILE_INITIALIZED">
            <v-flex>
              <span class="caption">{{$t('upBalance')}}:</span>&nbsp;
              <span class="asset">{{player.activebalance}}</span>        
            </v-flex>
            <v-flex>
              <span class="caption">{{$t('upVesting')}}:</span>&nbsp;
              <span class="asset" >{{player.vestingbalance}}</span>
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


