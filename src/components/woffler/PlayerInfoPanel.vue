<script>
import * as constants from '../../state/constants'
import ApplicationError from '../../dialogs/applicationError'

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
    constants
  }),
  methods: {
      async signup() {
        this.$ga.event('user', 'signup', '--', 0)
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('userProfile/signup')
        } catch (ex) {
          this.$dialog.error(new ApplicationError(ex))
        }
        loader.hide()
      },
      async forget() {
        this.$ga.event('user', 'forget', '--', 0)
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('userProfile/forget')
        } catch (ex) {
          this.$dialog.error(new ApplicationError(ex))
        }
        loader.hide()
      },
  }
}
</script>
<template>
  <v-container pa-0>
    <v-layout row justify-space-between align-center>
      <v-flex>
        <v-layout column justify-end align-start>
          <v-btn v-if="status === constants.PROFILE_LOGGEDIN"
            flex small flat outline @click="signup">Signup</v-btn>
          <v-btn v-if="status === constants.PROFILE_INITIALIZED"
            flex small flat outline @click="forget">Forget</v-btn>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout
          column justify-start align-end>      
          <template v-if="status === constants.PROFILE_INITIALIZED">
            <v-flex>
              <span class="caption">Balance:</span>&nbsp;
              <span class="asset">{{player.activebalance}}</span>        
            </v-flex>
            <v-flex>
              <span class="caption">Vesting:</span>&nbsp;
              <span class="asset">{{player.vestingbalance}}</span>
            </v-flex>
          </template>
          <span flex v-else>{{$t('upProfileNotInit')}}</span>        
        </v-layout>        
      </v-flex>
    </v-layout>
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


