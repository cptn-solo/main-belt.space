<script>
  import GamePanelsMenu from '../../components/woffler/GamePanelsMenu'
  import PlayerInfoPanel from '../../components/woffler/PlayerInfoPanel'
  import GamePanel from '../../components/woffler/GamePanel'
  import GameInfoPanel from '../../components/woffler/GameInfoPanel'
  import InfoPanel from '../../components/woffler/InfoPanel'
  import RootBranchPicker from '../../components/woffler/RootBranchPicker'
  import BranchMetaPanel from '../../components/woffler/branchmeta/BranchMetaPanel'
  import BranchMetaPicker from '../../components/woffler/BranchMetaPicker'
  import { mapState, mapGetters } from 'vuex'
  import * as constants from '../../state/constants'
  import vesting from './vestingMixin'

  export default {
    mixins:[ vesting ],
    components: {
      GamePanelsMenu,
      PlayerInfoPanel,
      InfoPanel,
      RootBranchPicker,
      GamePanel,
      GameInfoPanel,
      BranchMetaPanel,
      BranchMetaPicker,
    },
    data:() => ({
      constants,
      loading: false,
      playerInfoPanel: false,
      activePanel: null,
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState,
        currentLevel: state => state.woffler.currentLevelInfo,
        metas: state => state.woffler.brnchmetas,
      }),
      ...mapGetters('woffler', {
        startLevels: 'startLevels'
      }),
      hasCurrentGame() {
        return this.player.idlevel > 0
      },
      hasAvailableGames() {
        return this.startLevels.length > 0
      },
      hasIngameProfile() {
        return this.status === constants.PROFILE_INITIALIZED
      },
      loggedIn() {
        return this.status >= constants.PROFILE_LOGGEDIN
      },
      canPlay() {
        return this.hasIngameProfile && !this.hasCurrentGame
      }      
    },
    watch: {
      activePanel(n, o) {
        if (n.key != "info")
          this.loadData()
      },
    },
    methods: {
      setActivePanel(panel) {
        this.activePanel = panel
        console.log(panel)
      },
      async loadData() {
        this.loading = true
        try {
          if (this.hasIngameProfile > 0)
            await this.$store.dispatch('userProfile/loadAndProcessIngameProfile', this.player.account)

          if (this.activePanel.key === 'active')
            await this.$store.dispatch('woffler/fetchGameContext', this.player.idlevel)
          else
            await this.$store.dispatch('woffler/loadGameData')           
        } catch (ex) {
          this.$dialog.error(ex)
        }
        this.loading = false
      },
    }
  }
</script>

<template>
  <v-container pa-0>
    <v-layout column>
      <v-flex>
        <BranchMetaPanel :canPlay="canPlay"/>
        <v-toolbar style="z-index:2">
          <GamePanelsMenu
            :hasCurrentGame="hasCurrentGame"
            :hasAvailableGames="hasAvailableGames"
            :oldPanelKey="activePanel ? activePanel.key : ''"
            @panelselected="setActivePanel" />
          <v-toolbar-title v-if="activePanel">
            {{$t(activePanel.ttitle)}}
          </v-toolbar-title>
          <v-spacer />
          <v-btn v-if="activePanel && activePanel.key != 'info'"
            style="margin-right: -6px" :loading="loading" :disabled="loading"
            @click="loadData" icon><v-icon>cached</v-icon></v-btn>
          <template slot="extension" v-if="playerInfoPanel && loggedIn">
            <PlayerInfoPanel 
              :player="player" :status="status" 
              :showVesting="showVesting" :vestingReady="vestingReady" :vestingDate="vestingDate"/>
          </template>
          <v-btn v-if="loggedIn"
            fab small bottom absolute style="left: 50%; margin-left: -13px; margin-bottom: 8px; width: 26px; height: 26px;"
            @click.stop="playerInfoPanel = !playerInfoPanel">
            <v-icon v-if="playerInfoPanel">keyboard_arrow_up</v-icon>
            <v-icon v-else>keyboard_arrow_down</v-icon>
          </v-btn>
        </v-toolbar>
        <template v-if="activePanel">
          <BranchMetaPicker v-if="activePanel.key === 'metas'" 
            :metas="metas" :player="player"/>
          <RootBranchPicker v-else-if="activePanel.key === 'levels'"
            :startLevels="startLevels" :loggedIn="loggedIn" :hasIngameProfile="hasIngameProfile" />
          <template v-else-if="activePanel.key === 'active'">
            <GamePanel 
              :player="player" :level="currentLevel" 
              :showVesting="showVesting" :vestingReady="vestingReady" :vestingDate="vestingDate"/>
            <v-toolbar class="bottomBar">
              <GameInfoPanel :player="player" :level="currentLevel" />
            </v-toolbar>
          </template>
          <InfoPanel v-else />
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
  .bottomBar {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
</style>

