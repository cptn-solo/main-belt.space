<script>
  import WofflerPanel from '../components/woffler/WofflerPanel'  
  import RootBranchPicker from '../components/woffler/RootBranchPicker'
  import BranchMetaPanel from '../components/woffler/BranchMetaPanel'

  import { mapState, mapGetters } from 'vuex'
  import * as constants from '../state/constants'

  export default {
    components: {
      WofflerPanel,
      RootBranchPicker,
      BranchMetaPanel
    },
    data:() => ({
      loading: false,
      showLevelInfo: false,
      constants    
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState,
      }),
      ...mapGetters('woffler', {
        startLevels: 'startLevels'
      })
    },
    created: function() {
      this.loadData()
    },
    methods: {
      async loadData() {
        this.loading = true
        await this.$store.dispatch('woffler/loadBranchMetas')
        await this.$store.dispatch('woffler/loadBranches')
        await this.$store.dispatch('woffler/loadLevels')
        if (this.player.account.length > 0)
          await this.$store.dispatch('userProfile/loadAndProcessIngameProfile')
        this.loading = false
      },
      showlvlinfo(idx) {
        this.$store.dispatch('woffler/selectLevel', this.startLevels[idx])
        this.showLevelInfo = true
      },
      hideMeta() {
        this.showLevelInfo = false
        this.$store.dispatch('woffler/selectLevel', null)
      },
      startGame(level) {        
        this.showLevelInfo = false
        alert(level)
      },

    }
  }
</script>

<template>
  <v-container pa-0>
    <v-layout>
      <v-flex>
        <v-dialog v-model="showLevelInfo" scrollable max-width="500px">
          <BranchMetaPanel 
            :canPlay="status === constants.PROFILE_INITIALIZED"
            @start="startGame" @hideinfo="hideMeta"/>
        </v-dialog>
        <v-toolbar flat>
          <v-toolbar-title>{{$t('wflActiveGames')}}</v-toolbar-title>
          <v-spacer />
          <ReloadButton
            :loading="loading"
            @click="loadData"
          />
        </v-toolbar>
        <RootBranchPicker v-if="!player.levelresult"
          :startLevels="startLevels"
          @showlvlinfo="showlvlinfo"/>
        <WofflerPanel v-else
          class="wflbox"        
          :player="player"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style>
.wflbox {
    width: 200px;
    height: 200px;
    border: 1px solid black
}

</style>

