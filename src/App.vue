<script>
  import NavigationPanel from './components/NavigationPanel'
  import LinksPanel from './components/LinksPanel'
  import ProfilePanel from './components/ProfilePanel'
  import ImportPanel from './components/ImportPanel'
  import PlayerInfo from './components/woffler/PlayerInfoPanel'
  import LanguageSelector from './components/controls/LanguageSelector'
  import { mapState } from 'vuex'
  import * as constants from './state/constants'

  export default {
    components: {
      NavigationPanel, LinksPanel, ProfilePanel, ImportPanel, PlayerInfo, LanguageSelector
    },
    props: {
      source: String
    },
    data: () => ({
      drawer: null,
      version: 'v.' + process.env.VERSION + ' (' + process.env.BRANCH + ')',
      constants,
      importPanel: false,
      playerInfoPanel: false,
      darkTheme: true
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState,
      }),
    },
    mounted() {
      this.$store.dispatch('engine/launch')
    },
    watch: {
      status(n, o) {
        if (n === constants.PROFILE_INITIALIZED)
          this.playerInfoPanel = true
      }
    }    
  }
</script>

<template>
  <v-app :dark="darkTheme">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <NavigationPanel @toggledarktheme="darkTheme = !darkTheme"/>
      <LinksPanel />
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Belt</v-toolbar-title>
      <v-spacer/>
      <ProfilePanel :player="player" :status="status"
        @showimportpanel="importPanel = true" />
      <template slot="extension" v-if="playerInfoPanel && status >= constants.PROFILE_LOGGEDIN">
        <PlayerInfo :player="player" :status="status" />
      </template>
      <v-btn v-if="status >= constants.PROFILE_LOGGEDIN"
        fab small bottom absolute style="left: 50%; margin-left: -13px; margin-bottom: 8px; width: 26px; height: 26px;"
          @click="playerInfoPanel = !playerInfoPanel">
          <v-icon v-if="playerInfoPanel">keyboard_arrow_up</v-icon>
          <v-icon v-else>keyboard_arrow_down</v-icon>
      </v-btn>
      <LanguageSelector />
    </v-toolbar>
    <v-dialog v-model="importPanel" transition="slide-y-transition" width="300">
      <ImportPanel @finished="importPanel = false"/>
    </v-dialog>
    <v-content>
      <!-- moved outside layout to enable custom layouts in views -->
      <router-view></router-view>
      <!-- <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex shrink>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container> -->
    </v-content>
    <v-footer app fixed>
      <span class="version">&copy; 2019&nbsp;|&nbsp;{{ version }}</span>
    </v-footer>
  </v-app>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.blog-body {
  text-align: justify;
}
.outer-panel {
  width: 100%;
  align-items: center;
  justify-content: center;
}
.inner-panel {
  max-width: 500px;
  margin-left: 10px;
  margin-right: 10px;
}
.flex-column {
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  flex-direction: column;
}
.mt1 {
  margin-top: 1em;
}
.sf {
  font-size: smaller;
}
.version {
  position: absolute;
  left: 1em;
  bottom: 1em;
  font-size: smaller;
  color:slategray
}
</style>