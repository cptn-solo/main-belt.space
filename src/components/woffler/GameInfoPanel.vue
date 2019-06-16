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
      quitGame() {
        this.$store.dispatch('engine/enqueueAction', {
          title: 'quitgame', selector: 'woffler/joinGame',
          lock: true, payload: 0, //called with 0 switch to 0 branch (quit game)
          confirm: new QuitGameConfirm(),
          success: () => { this.$router.push({ path: "/woffler/levels" })}
        })
      },
      showLvlvInfo() {
        this.$store.dispatch('gui/showDialog', { key: "levelInfoDialog", payload: this.level })          
      }
    }
  }
</script>
<template>
  <v-container pa-0>
    <v-layout row justify-space-between align-center>
      <v-flex>
        <v-layout column justify-end align-start>
          <v-btn icon style="margin: 15px 0px 0px -5px"
            @click="quitGame">
            <v-icon color="warning">highlight_off</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout column justify-start align-end>
          <template v-if="level">
            <v-flex>
              <v-layout row justify-end align-center fill-height>
                <span flex class="caption" >{{$t('wflLevelId')}}:</span>
                <span flex class="asset" style="margin-left: 5px;">{{player.idlevel}}&nbsp;({{level.generation}}/{{level.branch.winlevgen}})</span>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row justify-end align-start fill-height>
                <span flex class="asset" style="line-height: 12px; text-align: right;">{{level.branch.meta.name}}</span>              
                <v-btn flex icon ripple style="width: 20px; height: 20px; margin: -3px -3px 0 0;"
                  @click="showLvlvInfo"><v-icon small>info</v-icon></v-btn>
              </v-layout>
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