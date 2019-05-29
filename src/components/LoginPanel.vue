<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ApplicationError from '../dialogs/applicationError'
  export default {
    data: () => ({
    }),
    methods: {
      ...mapActions('scatter', {
        login: 'login',
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
    }
  }
</script>

<template>
  <v-btn text @click="loginScatter" color="secondary">Login&nbsp;&nbsp;
    <img
      style="margin-right: -5px; width: 20px; height: 20px"
      src="/assets/images/scatter_badge_transparent.svg"
    >
  </v-btn>
</template>
