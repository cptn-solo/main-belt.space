<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from './dialogs/applicationError'
  
  export default {
    data: () => ({
      drawer: null,
      version: 'v.' + process.env.VERSION + ' (' + process.env.BRANCH + ')'
    }),
    props: {
      source: String
    },
    methods: {
      ...mapActions('scatter', {
        login: 'login',
        logout: 'logout',
      }),
      async loginScatter() {
        // +
        let loader = this.$loading.show()
        try {
          await this.login()
          this.$ga.event('user', 'loginScatter', 'success', 0)
        } catch (ex) {
          this.$ga.event('user', 'loginScatter', 'failure', 0)
          this.$dialog.error(ex)
        }
        loader.hide()
      },
      async logoutScatter() {
        // +
        this.$ga.event('user', 'logoutScatter', '--', 0)
        let loader = this.$loading.show()
        try {
          await this.logout()
        } catch (ex) {
          this.$dialog.error(new ApplicationError(ex))
        }
        loader.hide()
      }
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
      <v-btn text @click="loginScatter" color="secondary">Login&nbsp;&nbsp;
        <img
          style="margin-right: -5px; width: 20px; height: 20px"
          src="/assets/images/scatter_badge_transparent.svg"
        >
      </v-btn>
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