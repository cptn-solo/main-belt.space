<script>
  import PlayerInfoPanel from '../../components/woffler/PlayerInfoPanel'
  import GamePanel from '../../components/woffler/GamePanel'
  import InfoPanel from '../../components/woffler/InfoPanel'
  import RootBranchPicker from '../../components/woffler/RootBranchPicker'
  import BranchMetaPanel from '../../components/woffler/BranchMetaPanel'
  import { mapState, mapGetters } from 'vuex'
  import * as constants from '../../state/constants'
  import wofflerData from './wofflerData'

  export default {
    components: {
      PlayerInfoPanel,
      InfoPanel,
      RootBranchPicker,
      GamePanel,      
      BranchMetaPanel
    },
    data:() => ({
      constants,
      loading: false,
      playerInfoPanel: false,
      showLevelInfo: false,
      showPanelsList: false,
      activePanelIdx: 0,
      ...wofflerData
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
      hasCurrentGame() {
        return this.player.idlvl > 0
      },
      hasIngameProfile() {
        return this.status === constants.PROFILE_INITIALIZED
      },
      loggedIn() {
        return this.status >= constants.PROFILE_LOGGEDIN
      },
      activePanel() {
        return this.gamePanels[this.activePanelIdx]
      }
    },
    created: function() {
      this.loadData()
      if(this.hasCurrentGame)
        this.activePanelIdx = 2
    },
    watch: {
      selectedLevelInfo(n, o) {
        this.showLevelInfo = !!n
      },
      showLevelInfo(n, o) {
        if(!n) this.hidelvlinfo()
      },
      hasCurrentGame(n, o) {
        this.adjustPanelsVisibility()
        if (n)
          this.activePanelIdx = 2
      }
    },
    methods: {
      async loadData() {
        this.loading = true
        try {
          await this.$store.dispatch('woffler/loadGameData')
          if (this.hasIngameProfile > 0)
            await this.$store.dispatch('userProfile/loadAndProcessIngameProfile', this.player.account)
        } catch (ex) {
          this.$dialog.error(ex)
        }
        this.adjustPanelsVisibility()
        this.loading = false
      },
      adjustPanelsVisibility() {
        const activePanel = this.gamePanels.find(t => t.key === 'active')
        activePanel.hidden = !this.hasCurrentGame

        if (this.activePanelIdx === 2 && activePanel.hidden)
          this.activePanelIdx--
      },
      showlvlinfo(idx) {
        this.$store.dispatch('woffler/selectLevel', this.startLevels[idx])
      },
      hidelvlinfo() {
        this.$store.dispatch('woffler/selectLevel', null)
      },
      showlvlactions(idx) {
        const payload = this.startLevels[idx]
        const actions = []
        if (this.hasIngameProfile)
          actions.push(Object.assign(this.startGameAction, { payload: payload.idbranch }))
        else if (this.loggedIn)
          actions.push(Object.assign(this.signupAdnJoinGameAction, { payload }))
        
        actions.push(Object.assign(this.showRulesAction, { payload }))
        
        this.$store.dispatch('engine/requestActions', actions)
      },
      startGame(level) {        
        this.showLevelInfo = false        
        this.$store.dispatch('engine/enqueueAction', Object.assign(this.startGameAction, { 
          payload: level.branch.id
        }))
      },
      quitGame() {
        this.$store.dispatch('engine/enqueueAction', Object.assign(this.quitGameAction, { 
          payload: 0
        }))
      }
    }
  }
</script>

<template>
  <v-container pa-0>
    <v-layout column>
      <v-flex>
        <v-dialog v-model="showLevelInfo" scrollable max-width="500px">
          <BranchMetaPanel 
            :canPlay="hasIngameProfile"
            @start="startGame" @hideinfo="hidelvlinfo"/>
        </v-dialog>
        <v-toolbar style="z-index:2">
          <v-menu>
            <template slot="activator">
              <v-btn icon ripple 
                @click="showPanelsList = !showPanelsList"><v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-list>
              <template v-for="(panel, idx) in gamePanels">
                <v-list-tile v-if="!panel.hidden" :key="panel.key"
                  @click="activePanelIdx = idx">
                  <v-list-tile-action><v-icon v-text="panel.aicon"/></v-list-tile-action>
                  <v-list-tile-title>{{$t(panel.atitle)}}</v-list-tile-title>
                </v-list-tile>
              </template>
            </v-list>            
          </v-menu>
          <v-toolbar-title>{{$t(activePanel.ttitle)}}</v-toolbar-title>
          <v-spacer />
          <ReloadButton v-if="activePanelIdx > 0"
            style="margin-right: -6px"
            :loading="loading"
            @click="loadData"
          />
          <template slot="extension" v-if="playerInfoPanel && loggedIn">
            <PlayerInfoPanel :player="player" :status="status" />
          </template>
          <v-btn v-if="loggedIn"
            fab small bottom absolute style="left: 50%; margin-left: -13px; margin-bottom: 8px; width: 26px; height: 26px;"
            @click.stop="playerInfoPanel = !playerInfoPanel">
            <v-icon v-if="playerInfoPanel">keyboard_arrow_up</v-icon>
            <v-icon v-else>keyboard_arrow_down</v-icon>
          </v-btn>
        </v-toolbar>
        <RootBranchPicker v-if="activePanelIdx === 1"
          :startLevels="startLevels"
          :startAction="startGameAction"
          @showlvlinfo="showlvlinfo"
          @showlvlactions="showlvlactions" />
        <template v-else-if="activePanelIdx === 2">
          <GamePanel :player="player" />
          <v-btn outline class="quitBtn"
            @click="quitGame">{{$t('wflQuitGameBtn')}}</v-btn>
        </template> 
        <InfoPanel v-else />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
  .quitBtn {
    position: absolute;
    bottom: 10px;
    left: 16px;
  }
</style>

