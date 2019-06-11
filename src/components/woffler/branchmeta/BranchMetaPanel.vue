<script>
import { mapState } from 'vuex';
import { commonActions } from '../../../woffler/commonActions'
import DisplayField from './DisplayField'
import EditField from './EditField'
export default {
  props: {
    canPlay: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => [
        ['name', 'text 50'],
        ['owner', 'text', true],        
        ['startjailed','bool'],
        ['lvlgreens','int 14'],
        ['lvlreds','int 14'],
        ['potmin','asset'],
        ['stkmin','asset'],
        ['stkrate','%'],
        ['unjlmin','asset'],
        ['unjlrate','%'],
        ['buytrymin','asset'],
        ['buytryrate','%'],
        ['nxtrate','%'],
        ['spltrate','%'],
        ['tkrate','%'],
        ['tkintrvl','interval'],
        ['slsrate','%'],
        ['winnerrate','%'],
        ['url', 'text 150'],
      ]
    }
  },
  components: {
    DisplayField, EditField
  },
  data: () => ({
    meta: null
  }),
  watch: {
    levelInfo(n) {
      this.meta = n ? n.branch.meta : null
    }
  },
  computed: {
    ...mapState({
      levelInfo: state => state.gui.levelInfoDialog ? state.gui.payload : null,
      editMode: state => state.gui.levelInfoDialog && state.gui.props ? state.gui.props.editMode : false,
    }),
    showPlayBtn() {
      return this.canPlay && this.levelInfo && this.levelInfo.idparent === 0 && !this.levelInfo.locked && !this.editMode
    },
    showSaveBtn() {
      return this.editMode
    },
    dialog: {
      get() { return this.$store.state.gui.levelInfoDialog },
      set() { this.$store.dispatch('gui/showDialog', { key: "levelInfoDialog", payload: null, propa: null }) }
    }
  },
  methods: {
    startGame() {
      const idbranch = this.levelInfo.idbranch
      this.$store.dispatch('engine/enqueueAction',
        Object.assign(commonActions.joinGameAction), { payload: idbranch})
      this.dialog = false
    },
    changed(change) {
      console.log('meta changed: '+change.key, change.value)
      this.meta[change.key] = change.value
    },
    saveMeta() {
      const meta = this.meta
      const action = Object.assign(commonActions.brnchmetaAction, { 
        payload: { idmeta: meta.id, meta }})
      this.$store.dispatch('engine/enqueueAction', action)
      this.dialog = false
    }
  },
}
</script>
<template>
  <v-dialog v-model="dialog" scrollable max-width="500px">
    <v-card v-if="dialog">
      <v-card-title>{{$t('wflBrMetaInfoTitle')}}
        <template v-if="levelInfo && !editMode">:&nbsp;<b>{{levelInfo.branch.meta.name}}</b></template>
        </v-card-title>
      <v-divider />
      <v-card-text>
        <v-layout column v-if="levelInfo">
          <div flex v-for="(row, idx) in rows" :key="idx" class="my-1">
            <DisplayField v-if="!editMode"
              :value="{key: row[0], type: row[1], val: levelInfo.branch.meta[row[0]]}"
              class="list-title"
            />
            <EditField v-if="editMode && row.length < 3"
              :value="{key: row[0], type: row[1], val: levelInfo.branch.meta[row[0]]}"
              class="list-title"
              @changed="changed"
            />
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
        <v-btn v-else-if="showSaveBtn" small color="primary"
          @click="saveMeta">{{$t('wflBrMetaSaveBtn')}}
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
</style>


