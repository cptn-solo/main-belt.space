<script>
import { Api, JsonRpc } from 'eosjs'
import { TextDecoder, TextEncoder } from 'text-encoding'
import LocalSignatureProvider from '../../sigprovider/localSigner'
import gameAPI from '../../api/gameAPI'

export default {
  data:() => {
    return {
      apiURL: null,
      account: null,
      privateKey: null,
      showKey: false,
      loading: false,
    }
  },
  methods: {
    configureAPI() {
      const rpc = new JsonRpc(this.apiURL)
      gameAPI.accountname = this.account
      gameAPI.rpc = rpc
      gameAPI.api = new Api({
          rpc,
          signatureProvider: new LocalSignatureProvider(this.privateKey),
          textDecoder: new TextDecoder(),
          textEncoder: new TextEncoder(),
        })
      return gameAPI
    },
    async cleanupContractTables() {
      const _gameAPI = this.configureAPI()
      this.loading = true
      try {
        await _gameAPI.cleanupContractTables()
      } catch (ex) {
        this.$dialog.error(ex)
      } finally {
        this.loading = false
      }
      
    }
  }
    
}
</script>
<template>
  <div style="padding: 10px">
    <v-form>
      <v-text-field 
        v-model="apiURL"
        type="text"
        autocomplete="apiURL"
        name="apiURL" 
        placeholder="api endpoint URL"/><br>
      <v-text-field 
        v-model="account"
        prepend-icon="person"
        type="text"
        name="account"
        autocomplete="account"
        placeholder="account"/><br>
      <v-text-field 
        v-model="privateKey"
        prepend-icon="vpn_key"
        :append-icon="showKey ? 'visibility_off' : 'visibility'"
        :type="showKey ? 'text' : 'password'"
        @click:append="showKey = !showKey"
        name="privkey"
        autocomplete="privkey"
        placeholder="private key (active)"
      ></v-text-field>
      <v-btn 
        :loading="loading"
        :disabled="loading"
        @click="cleanupContractTables">Cleanup conract tables</v-btn>
    </v-form>
  </div>  
</template>

