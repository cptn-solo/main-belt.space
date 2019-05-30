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
    :close-on-content-click="false"
  >
    <template slot="activator">
      <span>{{player.activebalance}}&nbsp;|&nbsp;<b>{{player.account}}</b></span>
      <v-icon>
        arrow_drop_down
      </v-icon>
    </template>
    <v-list dense>
      <v-list-tile v-if="status < constants.PROFILE_INITIALIZED" 
        @click="signup">Signup: {{account}}</v-list-tile>
      <v-list-tile v-else-if="status === constants.PROFILE_INITIALIZED" 
        @click="forget">Forget</v-list-tile>
      <v-list-tile
        @click="logout">Logout</v-list-tile>      
    </v-list>
  </v-menu>
</template>
