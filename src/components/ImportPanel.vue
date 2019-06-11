<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'

  export default {
    data: () => ({
      showKey: false,
      valid: false,
      privateKey: '',
      accountName: ''
    }),
    methods: {
      async login() {
        let loader = this.$loading.show()
        try {
          await this.$store.dispatch('noscatter/login', {
            accountname: this.accountName,
            privKey: this.privateKey
          })
          this.$emit('finished')
        } catch (ex) {
          this.$dialog.error(new ApplicationError(ex))
        }
        loader.hide()
      },
    }
  }
</script>

<template>
  <v-card>
    <v-card-title>
      {{$t('upImportKeyTitle')}}
    </v-card-title>
    <v-divider/>
    <v-card-text>
      <VForm>
          <v-list style="width: 100%">
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
          </v-list>
        </VForm>
    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn text @click="login" style="width: 100%">
        {{$t('upImportKeyBtn')}}&nbsp;&nbsp;<v-icon>input</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
