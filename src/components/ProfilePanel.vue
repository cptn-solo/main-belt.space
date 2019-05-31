<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'
  import * as constants from '../state/constants'

  export default {
    data: () => ({
      showMenu: false,
      constants
    }),
    props: {
      player: {
        type: Object,
        default: null,
      },
      status: {
        type: Number,
        default: constants.PROFILE_UNKNOWN
      }
    },
    computed: {
      ...mapGetters('userProfile', {
        account: 'accountname'
      })
    },
    methods: {
      importPrompt() {
        this.$emit('showimportpanel')
      },
      async loginScatter() {
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('scatter/login')
          this.$ga.event('user', 'loginScatter', 'success', 0)
        } catch (ex) {
          this.$ga.event('user', 'loginScatter', 'failure', 0)
          this.$dialog.error(ex)
        }
        loader.hide()
      },
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
      async logout() {
        // +
        this.$ga.event('user', 'logout', '--', 0)
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('userProfile/logout')
        } catch (ex) {
          this.$dialog.error(new ApplicationError(ex))
        }
        loader.hide()
      }
    }
  }
</script>

<template>
  <v-menu
    v-model="showMenu"
    offset-y
    offset-x
    :nudge-bottom="15"    
  >
    <template slot="activator">
      <span v-if="status === constants.PROFILE_INITIALIZED">
        {{player.activebalance}}&nbsp;|&nbsp;<b>{{player.account}}</b>
      </span>
      <span v-else-if="status === constants.PROFILE_LOGGEDIN">
        {{$t('upProfileNotInit')}}
      </span>
      <span v-else>
        {{$t('upLogin')}}
      </span>
      <v-icon>
        arrow_drop_down
      </v-icon>
    </template>
    <v-list dense>
      <template v-if="status < constants.PROFILE_LOGGEDIN">
        <v-list-tile @click="loginScatter">
          <v-list-tile-content>{{$t('upLoginScatterBtn')}}</v-list-tile-content>
          <v-list-tile-action><v-btn icon><img
            style="margin-right: -5px; width: 20px; height: 20px"
            src="/assets/images/scatter_badge_transparent.svg">
          </v-btn></v-list-tile-action>
        </v-list-tile>
        <v-list-tile @click="importPrompt">
          <v-list-tile-content>{{$t('upImportKeyBtn')}}</v-list-tile-content>
          <v-list-tile-action><v-icon>input</v-icon></v-list-tile-action>                
        </v-list-tile>
      </template>
      <v-list-tile v-if="status === constants.PROFILE_LOGGEDIN"
        @click="signup">Signup: {{account}}</v-list-tile>
      <v-list-tile v-else-if="status === constants.PROFILE_INITIALIZED"
        @click="forget">Forget</v-list-tile>
      <v-list-tile v-if="status >= constants.PROFILE_LOGGEDIN"
        @click="logout">Logout</v-list-tile>
    </v-list>    
  </v-menu>
</template>
