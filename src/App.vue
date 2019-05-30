<script>
  import ScatterPanel from './components/ScatterPanel'
  import ImportPanel from './components/ImportPanel'
  import ProfilePanel from './components/ProfilePanel'
  import { mapState } from 'vuex'
  import * as constants from './state/constants'

  export default {
    data: () => ({
      drawer: null,
      version: 'v.' + process.env.VERSION + ' (' + process.env.BRANCH + ')',
      constants
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,
        status: state => state.userProfile.profileState
      }),
    },
    mounted() {
      this.$store.dispatch('engine/launch')
    },
    components: {
      ScatterPanel,
      ImportPanel,
      ProfilePanel
    },
    props: {
      source: String
    },
    methods: {
    }
  }
</script>

<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/about">
          <v-list-tile-title>About</v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/woffler">
          <v-list-tile-title>Woffler Game</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Belt</v-toolbar-title>
      <v-spacer/>
      <ScatterPanel v-if="status < constants.PROFILE_LOGGEDIN"/>
      <ImportPanel v-show="status < constants.PROFILE_LOGGEDIN"/><!-- v-show used as this component must present in DOM to avoid warns -->
      <ProfilePanel v-if="status >= constants.PROFILE_LOGGEDIN" :player="player" :status="status" />
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex shrink>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
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
  margin-left: 50px;
  margin-right: 50px;
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