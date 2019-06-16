<script>
  import NavigationPanel from './components/NavigationPanel'
  import LinksPanel from './components/LinksPanel'
  import ProfilePanel from './components/ProfilePanel'
  import ImportPanel from './components/ImportPanel'
  import ActionsPanel from './components/ActionsPanel'
  import AccountResManagePanel from './components/AccountResManagePanel'
  import LanguageSelector from './components/controls/LanguageSelector'
  import { mapState } from 'vuex'
  import * as constants from './state/constants'

  export default {
    components: {
      NavigationPanel, LinksPanel, ProfilePanel, ImportPanel, ActionsPanel, LanguageSelector,
      AccountResManagePanel,
    },
    props: {
      source: String
    },
    data: () => ({
      drawer: null,
      version: 'v.' + process.env.VERSION + ' (' + process.env.BRANCH + ')',
      constants,
      importPanel: false,    
      currentRoute: { name: "home"},
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState,
        darkTheme: state => (!state.settings.theme || state.settings.theme === 'dark'),
      }),
      toolbarFlat() { 
        return this.currentRoute.name === "woffler"
      }
    },
    mounted() {
      this.$store.dispatch('engine/launch')
    },
    watch: {
      '$route'(n, o) {
        if (n && n.name) this.currentRoute = n 
      },
      status(n, o) {
        if (n === constants.PROFILE_INITIALIZED)
          this.playerInfoPanel = true
      },
    },
    methods: {
      toggleDarkTheme() {
        this.$store.dispatch('settings/setTheme', this.darkTheme ? 'light' : 'dark')
        this.drawer = false
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
      <NavigationPanel @toggledarktheme="toggleDarkTheme"/>
      <LinksPanel />
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left :flat="toolbarFlat">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{$t('routeTitle'+currentRoute.name)}}</v-toolbar-title>
      <v-spacer/>
      <ProfilePanel :player="player" :status="status"
        @showimportpanel="importPanel = true" />
      <LanguageSelector />
    </v-toolbar>
    <v-dialog v-model="importPanel" transition="slide-y-transition" width="300">
      <ImportPanel @finished="importPanel = false"/>
    </v-dialog>
    <ActionsPanel />
    <AccountResManagePanel />
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