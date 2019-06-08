<script>
import { mapState } from 'vuex';
import { commonActions } from '../../woffler/commonActions'
export default {
  props: {
    canPlay: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => [
        ['owner', 'text'],
        ['startjailed','bool'],
        ['lvlgreens','int'],
        ['lvlreds','int'],
        ['potmin','asset'],
        ['tkrate','%'],
        ['tkintrvl','interval'],
        ['unjlmin','asset'],
        ['unjlrate','%'],
        ['nxtrate','%'],
        ['spltrate','%'],
        ['stkrate','%'],
        ['stkmin','asset'],
        ['slsrate','%'],
        ['winnerrate','%'],
      ]
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapState({
      levelInfo: state => state.gui.payload,
    }),
    showPlayBtn() {
      return this.canPlay && this.levelInfo && this.levelInfo.idparent === 0 && !this.levelInfo.locked
    },
    dialog: {
      get() { return this.$store.state.gui.levelInfoDialog },
      set() { this.$store.dispatch('gui/showDialog', { key: "levelInfoDialog", payload: null }) }
    }
  },
  methods: {
    startGame() {
      const idbranch = this.levelInfo.idbranch
      this.$store.dispatch('engine/enqueueAction',
        Object.assign(commonActions.startGameAction), { payload: idbranch})
      this.dialog = false
    },
  },
}
</script>
<template>
  <v-dialog v-model="dialog" scrollable max-width="500px">
    <v-card v-if="dialog">
      <v-card-title>{{$t('wflBrMetaInfoTitle')}}
        <template v-if="levelInfo">:&nbsp;<b>{{levelInfo.branch.meta.name}}</b></template>
        </v-card-title>
      <v-divider />
      <v-card-text>
        <v-layout column v-if="levelInfo">
          <div flex v-for="(row, idx) in rows" :key="idx" class="my-1">
              <div class="list-title">
                {{$t('wflBrMeta'+row[0])}}:&nbsp;
                <b v-if="row[1] === 'bool'">{{$t('miskYESNO'+levelInfo.branch.meta[row[0]])}}</b>
                <b v-else>{{levelInfo.branch.meta[row[0]]}}
                  <span v-if="row[1] === '%'">&nbsp;%</span>
                </b>
              </div>
              <div class="subtitle">
                {{$t('wflBrMeta'+row[0]+'h')}}
              </div>
            </div>
        </v-layout>      
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer/>
        <v-btn small flat outline 
          @click="dialog = false">{{$t('wflBrMetaCloseBtn')}}
        </v-btn>
        <v-btn v-if="showPlayBtn" small color="primary"
          @click="startGame">{{$t('wflBrMetaPlayBtn')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.list-title {
  text-align: left;
  font-weight: bolder;
}
.subtitle {
  font-size: smaller;
  text-align: left;
}
</style>


