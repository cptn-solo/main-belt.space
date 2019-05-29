<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'
  export default {
    data: () => ({
      showMenu: false
    }),
    props: {
      player: {
        type: Object,
        default: null,
      }
    },
    methods: {
      ...mapActions('scatter', {
        logout: 'logout',
      }),
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
  <v-menu
    v-model="showMenu"
    offset-y
    offset-x
    :nudge-bottom="15"
    :close-on-content-click="false"
  >
    <template slot="activator">
      <span>{{player.activebalance}}&nbsp;|&nbsp;<b>{{player.account}}</b></span>
      <v-icon>
        arrow_drop_down
      </v-icon>
    </template>
    <v-list dense>
      <v-list-tile @click="logoutScatter">Logout</v-list-tile>
    </v-list>
  </v-menu>
</template>
