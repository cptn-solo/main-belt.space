<script>
  const PANEL_INFO = 0
  const PANEL_LIST = 1
  const PANEL_ACTIVE = 2

  export default {
    props: {
      hasAvailableGames: {
        type: Boolean,
        default: false
      },
      hasCurrentGame: {
        type: Boolean,
        default: false
      }
    },
    data: ()=> {return {
      showPanelsList: false,
      activePanelIdx: PANEL_INFO,
      gamePanels: [
        { key: 'info', ttitle: 'wflInfoPanelTitle', atitle: 'wflInfoActionTitle', aicon: 'help_outline' },
        { key: 'levels', ttitle: 'wflStartBranchesPanelTitle', atitle: 'wflStartBranchesActionTitle', aicon: 'list' },
        { key: 'active', ttitle: 'wflActiveGamePanelTitle', atitle: 'wflActiveGameActionTitle', aicon: 'videogame_asset', hidden: true }
      ],
    }},
    created() {
      this.adjustPanelsVisibility()
      this.pickActivePanel(this.hasCurrentGame ? PANEL_ACTIVE : this.hasAvailableGames ? PANEL_LIST : PANEL_INFO)
    },
    watch: {    
      hasCurrentGame(n, o) {
        this.adjustPanelsVisibility()
        if (n)
          this.pickActivePanel(PANEL_ACTIVE)
      }
    },
    methods: {
      pickActivePanel(idx) {
        this.activePanelIdx = idx
        this.$emit('panelselected', this.gamePanels[idx])
      },
      adjustPanelsVisibility() {
        const activePanel = this.gamePanels.find(t => t.key === 'active')
        activePanel.hidden = !this.hasCurrentGame

        if (this.activePanelIdx === PANEL_ACTIVE && activePanel.hidden) 
          this.pickActivePanel(PANEL_LIST)        
      },
    }
  }
</script>

<template>
  <v-menu>
    <template slot="activator">
      <v-btn icon ripple>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <v-list>
      <template v-for="(panel, idx) in gamePanels">
        <v-list-tile v-if="!panel.hidden" :key="panel.key"
          @click="pickActivePanel(idx)">
          <v-list-tile-action><v-icon v-text="panel.aicon"/></v-list-tile-action>
          <v-list-tile-title>{{$t(panel.atitle)}}</v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>
