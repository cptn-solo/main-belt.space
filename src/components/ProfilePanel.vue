<script>
  import { mapGetters, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'
  import AccountResourcesInfo from './AccountResourcesInfo'
  import * as constants from '../state/constants'

  export default {
    data: () => ({
      showMenu: false,
      constants
    }),
    components: {
      AccountResourcesInfo
    },
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
        account: 'accountname',        
      }),
      ...mapState({
        accountBalance: state => state.userProfile.accountBalance
      })
    },
    methods: {
      importPrompt() {
        this.$emit('showimportpanel')
      },
      manageResources() {
        console.log('manage')
        this.$store.dispatch('gui/showDialog', { key: 'resManagerDialog', payload: true })
      },
      async loginScatter() {
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('scatter/login')
        } catch (ex) {
          this.$dialog.error(ex)
        }
        loader.hide()
      },
      async logout() {
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
  <v-menu v-model="showMenu">
    <template slot="activator">
      <span v-if="status >= constants.PROFILE_LOGGEDIN"
        style="text-align: right; line-height: 14px; margin-top: 15px">
        <b>{{account}}</b><br><span style="font-size:smaller; color: gray">{{accountBalance}}</span>
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
        <v-list-tile @click="loginScatter" style="width: 200px">
          <v-list-tile-content>{{$t('upLoginScatterBtn')}}</v-list-tile-content>
          <v-list-tile-action><v-btn icon><img
            style="margin-right: -5px; width: 20px; height: 20px"
            src="/assets/images/scatter_badge_transparent.svg">
          </v-btn></v-list-tile-action>
        </v-list-tile>
        <v-list-tile @click="importPrompt" style="width: 200px">
          <v-list-tile-content>{{$t('upImportKeyBtn')}}</v-list-tile-content>
          <v-list-tile-action><v-icon>input</v-icon></v-list-tile-action>                
        </v-list-tile>
      </template>
      <template v-if="status >= constants.PROFILE_LOGGEDIN">
        <v-list-tile 
          @click="logout" >
          <v-list-tile-content>{{$t('upLogout')}}</v-list-tile-content>
          <v-list-tile-action><v-icon>power_settings_new</v-icon></v-list-tile-action>                
        </v-list-tile>
        <v-list-tile 
          @click="manageResources">
          <AccountResourcesInfo ripple v-if="status >= constants.PROFILE_LOGGEDIN" />
        </v-list-tile>
      </template>
    </v-list>    
  </v-menu>
</template>
