<script>
  import GamePanelsMenu from '../../components/woffler/GamePanelsMenu'
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
      GamePanelsMenu,
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
      activePanel: null,      
      ...wofflerData
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState,        
        currentLevel: state => state.woffler.currentLevelInfo,
        selectedLevelInfo: state => state.woffler.selectedLevelInfo,
      }),
      ...mapGetters('woffler', {
        startLevels: 'startLevels'
      }),
      hasCurrentGame() {
        return this.player.idlvl > 0
      },
      hasAvailableGames() {
        return this.startLevels.length > 0
      },
      hasIngameProfile() {
        return this.status === constants.PROFILE_INITIALIZED
      },
      loggedIn() {
        return this.status >= constants.PROFILE_LOGGEDIN
      }
    },
    watch: {
      activePanel(n, o) {
        if (n.key != "info")
          this.loadData()
      },
      selectedLevelInfo(n, o) {
        this.showLevelInfo = !!n
      },
      showLevelInfo(n, o) {
        if(!n) this.hidelvlinfo()
      },
    },
    methods: {
      setActivePanel(panel) {
        this.activePanel = panel
      },
      async loadData() {
        this.loading = true
        try {
          if (this.hasIngameProfile > 0)
            await this.$store.dispatch('userProfile/loadAndProcessIngameProfile', this.player.account)

          switch (this.activePanel.key) {
            case 'active':
              await this.$store.dispatch('woffler/fetchCurrentLevel', this.player.idlvl)
              break;
            default:
              await this.$store.dispatch('woffler/loadGameData')
              break;
          }
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
          <GamePanelsMenu 
            :hasCurrentGame="hasCurrentGame"
            :hasAvailableGames="hasAvailableGames"
            @panelselected="setActivePanel" />
          <v-toolbar-title v-if="activePanel">
            {{$t(activePanel.ttitle)}}
          </v-toolbar-title>
          <v-spacer />
          <ReloadButton v-if="activePanel && activePanel.key != 'info'"
            style="margin-right: -6px"
            :loading="loading"
            @click="loadData"/>
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
        <template v-if="activePanel">
          <RootBranchPicker v-if="activePanel.key === 'levels'"
            :startLevels="startLevels"
            :startAction="startGameAction"
            @showlvlinfo="showlvlinfo"
            @showlvlactions="showlvlactions" />
          <template v-else-if="activePanel.key === 'active'">
            <GamePanel :player="player" :level="currentLevel"/>
            <v-btn outline class="quitBtn"
              @click="quitGame">{{$t('wflQuitGameBtn')}}</v-btn>
          </template> 
          <InfoPanel v-else />
        </template>
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

