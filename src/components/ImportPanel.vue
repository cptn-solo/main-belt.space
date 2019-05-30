<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'

  export default {
    data: () => ({
      showMenu: false,
      showKey: false,
      valid: false,
      privateKey: ''
    }),
    methods: {
      async login() {
        this.$ga.event('user', 'import', '--', 0)
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('noscatter/login', this.privateKey)
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
    <v-list dense>
      <v-list-tile>
        <v-list-tile-content>
          <VForm>
            <input
              type="text"
              style="display: none"
              name="username"
              autocomplete="username"
              value="woffler key"
            >
            <VTextField
              v-model="privateKey"
              :append-icon="showKey ? 'visibility_off' : 'visibility'"
              :type="showKey ? 'text' : 'password'"
              name="password"
              :placeholder="$t('upImportKeyPH')"
              autocomplete="current-password"                            
              @keydown.enter.prevent="login"
              @click:append="showKey = !showKey"
            />
          </VForm>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon small @click="login"><v-icon>input</v-icon></v-btn>          
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>
