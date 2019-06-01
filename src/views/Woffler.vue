<script>
  import WofflerPanel from '../components/woffler/WofflerPanel'  
  import RootBranchPicker from '../components/woffler/RootBranchPicker'
  import BranchMetaPanel from '../components/woffler/BranchMetaPanel'
  import { BranchSwitchConfirm } from '../dialogs/wofflerConfirmations'
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
      constants,
      startGameAction: {
        icon: 'play_circle_outline', 
        title: 'wflActionJoinGame', 
        selector: 'woffler/joinGame',
        lock: true, confirm: new BranchSwitchConfirm()
        //add payload before use
      }
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState,
        selectedLevelInfo: state => state.woffler.selectedLevelInfo,
      }),
      ...mapGetters('woffler', {
        startLevels: 'startLevels'
      }),      
    },
    created: function() {
      this.loadData()
    },
    watch: {
      selectedLevelInfo(n, o) {
        this.showLevelInfo = !!n
      },
      showLevelInfo(n, o) {
        if(!n) this.hidelvlinfo()
      }
    },
    methods: {
      async loadData() {        
        this.loading = true
        try {
          await this.$store.dispatch('woffler/loadBranchMetas')
          await this.$store.dispatch('woffler/loadBranches')
          await this.$store.dispatch('woffler/loadLevels')
          if (this.player.account.length > 0)
            await this.$store.dispatch('userProfile/loadAndProcessIngameProfile', this.player.account)
        } catch (ex) {
          this.$dialog.error(ex)
        }
        this.loading = false
      },
      showlvlinfo(idx) {
        this.$store.dispatch('woffler/selectLevel', this.startLevels[idx])
      },
      hidelvlinfo() {
        this.$store.dispatch('woffler/selectLevel', null)
      },
      startGame(level) {        
        this.showLevelInfo = false
        this.$store.dispatch('engine/enqueueAction', Object.assign(this.startGameAction, { 
          payload: level
        }))
      },
    }
  }
</script>

<template>
  <v-container pa-0>
    <v-layout column>
      <v-flex>
        <v-dialog v-model="showLevelInfo" scrollable max-width="500px">
          <BranchMetaPanel 
            :canPlay="status === constants.PROFILE_INITIALIZED"
            @start="startGame" @hideinfo="hidelvlinfo"/>
        </v-dialog>
        <v-toolbar flat>
          <v-toolbar-title>{{$t('wflActiveGames')}}</v-toolbar-title>
          <v-spacer />
          <ReloadButton
            :loading="loading"
            @click="loadData"
          />
        </v-toolbar>
        <WofflerPanel v-if="player.idlvl != 0"
          class="wflbox"        
          :player="player" />
        <RootBranchPicker v-else
          :startLevels="startLevels"
          :startAction="startGameAction"
          @showlvlinfo="showlvlinfo" />
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

