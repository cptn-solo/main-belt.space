<script>
  import WofflerPanel from '../components/woffler/WofflerPanel'  
  import RootBranchPicker from '../components/woffler/RootBranchPicker'
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      WofflerPanel,
      RootBranchPicker
    },
    data:() => ({
      loading: false
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,    
      }),
      ...mapGetters('woffler', {
        branches: 'rootBranches'
      })
    },
    created: function() {
      this.loadData()
    },
    methods: {
      async loadData() {
        this.loading = true
        if (this.player.levelresult === 0)
          await this.$store.dispatch('woffler/loadBranches')
        else if (this.player.account.length > 0)
          await this.$store.dispatch('userProfile/loadAndProcessIngameProfile')
        this.loading = false
      }
    }
  }
</script>

<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Woffler game</v-toolbar-title>
      <v-spacer></v-spacer>
      <ReloadButton
        :loading="loading"
        @click="loadData"
      />
    </v-toolbar>
    <v-card-text>
      <RootBranchPicker v-if="!player.levelresult"
        class="wflbox"                 
        :branches="branches"/>
      <WofflerPanel v-else
        class="wflbox"        
        :player="player"/>
    </v-card-text>
    <v-card-actions>
      <v-btn icon>
        <v-icon>favorite</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
.wflbox {
    width: 320px;
    height: 320px;
    border: 1px solid black
}

</style>

