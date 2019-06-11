<script>
import { commonActions } from '../../woffler/commonActions'
import { CreateBranchConfirm } from '../../dialogs/wofflerConfirmations'
import AssetPanel from './AssetPanel'
import defaultMeta from '../woffler/branchmeta/defaultMeta.json'
import utils from '../../utils';

export default {
  props: {
    player: {
      type: Object, default: null
    },
    metas: {
      type: Array, default: () => []
    },
    rows: {
      type: Array,
      default: () => [
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
    },    
  },
  components: {
    AssetPanel
  },
  computed: {
    loggedIn() { 
      return !!this.player.account
    }
  },
  methods: {
      showMeta(idx) {
        const meta = this.metas[idx]
        this.$store.dispatch('gui/showDialog', { 
          key: "levelInfoDialog", payload: { branch: { meta }} })
      },
      createBranchWithMeta(idx) {
        const meta = this.metas[idx]

        if (!this.loggedIn || utils.assetAmount(this.player.activebalance) < utils.assetAmount(meta.minPot)) {
          this.$dialog.warning({
            text: this.$t('wflCreateBranchConditioinsWarnText', [meta.minPot]),
            title: this.$t('wflCreateBranchConditioinsWarnTitle')
          })
          return
        }

        const branchAction = Object.assign({}, commonActions.branchAction)
        branchAction.payload = { idmeta: meta.id }
        branchAction.confirm = new CreateBranchConfirm([meta.id])
        this.$store.dispatch('gui/showDialog', { key: "branchDialog", payload: branchAction })
      },
      createBranchMeta() {
        const meta = defaultMeta
        meta.id = 0 //for contract integrity checks
        meta.owner = this.player.account //for contract integrity checks
        this.$store.dispatch('gui/showDialog', { 
          key: "levelInfoDialog", 
          payload: { branch: { meta }},
          props: { editMode: true }
        })
      },
      showActions(idx) {
        const meta = this.metas[idx]
        const actions = []
        if (this.loggedIn) {
          const branchAction = Object.assign({}, commonActions.branchAction)
          branchAction.payload = { idmeta: meta.id }
          branchAction.confirm = new CreateBranchConfirm([meta.id])
          actions.push(Object.assign(commonActions.branchDialogAction, { 
            payload: { key: "branchDialog", payload: branchAction } }))                    
          
          if (meta.owner === this.player.account) {
            actions.push(Object.assign(commonActions.modifyRulesAction, { 
              payload: { key: "levelInfoDialog", payload: { branch: { meta }}, props: { editMode: true } } }))                    

            actions.push(Object.assign(commonActions.deleteRulesAction, { 
              payload: { idmeta: meta.id } }))            
          }
        }

        actions.push(Object.assign(commonActions.showRulesAction, { 
          payload: { 
            key: "levelInfoDialog", 
            payload: { branch: { meta }}}}))

        this.$store.dispatch('engine/requestActions', actions)
      },    
  }
}
</script>
<style scoped>
.mtitle {
  font-weight: bold; 
  line-height: 14px;
  margin-bottom: 4px;
}
.mowner {
  color: gray;
}
.bage {
  height: 16px;
  font-weight: bolder; 
  font-size: smaller;
}
.bage.asset {
  font-weight: bolder
}
</style>

<template>
  <v-layout column>    
    <v-card flex v-for="(meta, idx) in metas" :key="idx" style="margin:2px"      
      @click="showActions(idx)">
      <v-card-text>
        <div style="text-align: left">
          <v-layout row justify-space-between>
            <span class="mtitle">#{{meta.id}}:&nbsp;{{meta.name}}</span>
            <v-chip v-if="meta.startjailed" class="bage" color="warning">{{$t('wflPaidStartBage')}}</v-chip>
          </v-layout>          
        </div>
        <v-chip class="bage">{{$t('wflPotsFrom')}}:&nbsp;<span class="asset">{{meta.minPot}}</span></v-chip>
        <v-layout row justify-space-between>
          <v-layout flex row wrap justify-space-between>
            <div flex v-for="(row, idx) in rows" :key="idx" class="mx-1">
              <div>
                {{$t('wflBrMetaS'+row[0])}}:&nbsp;
                <b v-if="row[1] === 'bool'">{{$t('miskYESNO'+meta[row[0]])}}</b>              
                <b v-else>
                  <span>{{meta[row[0]]}}</span>
                  <span v-if="row[1] === '%'">%</span>
                  <span v-else-if="row[1] === 'interval'">&nbsp;{{$t('miskSeconds')}}</span>
                </b>
              </div>
            </div>
          </v-layout>
          <div flex style="width: 40px">
            <v-layout column>
              <v-btn flex icon
                @click.stop="createBranchWithMeta(idx)">
                <v-icon>play_circle_outline</v-icon></v-btn>
              <v-btn flex icon
                @click.stop="showMeta(idx)">
                <v-icon>info</v-icon></v-btn>
            </v-layout>
          </div>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-btn style="margin: 20px 0 20px 0"
      @click="createBranchMeta">
      <v-icon ripple mr-2>add</v-icon>
      create your own rules!
    </v-btn>
    <AssetPanel guiKey="branchDialog" 
      :placeholder="$t('wlfCreateBranchPotPH')">
      <template #title>{{$t('wlfCreateBranchPot')}}</template>
    </AssetPanel>

  </v-layout>
</template>