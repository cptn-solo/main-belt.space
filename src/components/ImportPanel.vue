<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'

  export default {
    data: () => ({
      showMenu: false,
      showKey: false,
      valid: false,
      privateKey: '',
      accountName: ''
    }),
    methods: {
      async login() {
        this.$ga.event('user', 'import', '--', 0)
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('noscatter/login', {
            accountname: this.accountName, 
            privKey: this.privateKey 
          })
          this.showMenu = false
        } catch (ex) {
          this.$dialog.error(new ApplicationError(ex))
        }
        loader.hide()
      },
    }
  }
</script>

<template>
  <v-menu id="importMenu"
    v-model="showMenu"
    offset-y
    offset-x
    :nudge-bottom="15"
    :close-on-content-click="false"
  >
    <template slot="activator">
      <span>Other</span>
      <v-icon>
        arrow_drop_down
      </v-icon>
    </template>
    <VForm>
      <v-list style="width: 300px">
        <v-list-tile>
          <v-list-tile-content>
            <VTextField
              style="width: 100%"
              v-model="accountName"
              prepend-icon="person"
              type="text"
              name="username"
              autocomplete="username"
              :placeholder="$t('upImportAccountPH')"
            />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <VTextField
              style="width: 100%"
              v-model="privateKey"
              prepend-icon="vpn_key"
              :append-icon="showKey ? 'visibility_off' : 'visibility'"
              :type="showKey ? 'text' : 'password'"
              name="password"
              :placeholder="$t('upImportKeyPH')"
              autocomplete="current-password"                            
              @keydown.enter.prevent="login"
              @click:append="showKey = !showKey"
            />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>        
          <v-list-tile-content>            
            <v-btn text @click="login" style="width: 100%">
              {{$t('upImportKeyBtn')}}&nbsp;&nbsp;<v-icon>input</v-icon>
            </v-btn>            
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </VForm>    
  </v-menu>
</template>
