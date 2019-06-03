<script>
  import * as constants from '../../state/constants'
  import ApplicationError from '../../dialogs/applicationError'
  import { UserProfileForgetKeyConfirm } from '../../dialogs/userProfileConfirmations'
  import { QuitGameConfirm } from '../../dialogs/wofflerConfirmations'

  export default {
    props: {
      player: {
        type: Object,
        default: null
      },
      level: {
        type: Object,
        default: null
      }
    },
    data: () => ({
      constants
    }),
    methods: {
      async quitGame() {
        this.$store.dispatch('engine/enqueueAction', {
          title: 'quitgame', selector: 'woffler/joinGame',
          lock: true, payload: 0, //called with 0 switch to 0 branch (quit game)
          confirm: new QuitGameConfirm()
        })
      },
    }
  }
</script>
<template>
  <v-container pa-0>
    <v-layout row justify-space-between align-center>
      <v-flex>
        <v-layout column justify-end align-start>
          <v-btn small outline color="warning"
            @click="quitGame">{{$t('wflQuitGameBtn')}}</v-btn>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout
          column justify-start align-end>
          <template>
            <v-flex>
              <span class="caption">{{$t('wflLevelId')}}:</span>&nbsp;
              <span class="asset">{{player.idlvl}}</span>
            </v-flex>
            <v-flex v-if="level">
              <span class="asset">{{level.branch.meta.name}}</span>
            </v-flex>
          </template>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
  .caption {
    font-size: smaller;
    color: gray
  }
  .asset {
    font-weight: bolder
  }
</style>