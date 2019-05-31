<script>
  import WofflerPanel from '../components/woffler/WofflerPanel'  
  import RootBranchPicker from '../components/woffler/RootBranchPicker'
  import BranchMetaPanel from '../components/woffler/BranchMetaPanel'

  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      WofflerPanel,
      RootBranchPicker,
      BranchMetaPanel
    },
    data:() => ({
      loading: false,
      showBranchInfo: false      
    }),
    computed: {
      ...mapState({
        player: state => state.userProfile.player,    
      }),
      ...mapGetters('woffler', {
        branches: 'rootBranches'
      })
    },
    created: function() {
      this.loadData()
    },
    methods: {
      async loadData() {
        this.loading = true
        await this.$store.dispatch('woffler/loadBranchMetas')
        await this.$store.dispatch('woffler/loadBranches')
        await this.$store.dispatch('woffler/loadLevels')
        if (this.player.account.length > 0)
          await this.$store.dispatch('userProfile/loadAndProcessIngameProfile')
        this.loading = false
      },
      showbranchinfo(idx) {
        this.$store.dispatch('woffler/selectBranch', this.branches[idx])
        this.showBranchInfo = true
      },
      hideMeta() {
        this.showBranchInfo = false
        this.$store.dispatch('woffler/selectBranch', null)
      },
      startGame(branch) {        
        this.showBranchInfo = false
        alert(branch)
      },

    }
  }
</script>

<template>
  <v-card>
    <v-dialog v-model="showBranchInfo">
      <BranchMetaPanel @start="startGame" @hideinfo="hideMeta"/>
    </v-dialog>
    <v-toolbar>
      <v-toolbar-title>Woffler game</v-toolbar-title>
      <v-spacer></v-spacer>
      <ReloadButton
        :loading="loading"
        @click="loadData"
      />
    </v-toolbar>
    <v-card-text>
      <RootBranchPicker v-if="!player.levelresult"
        class="wflbox"                 
        :branches="branches"
        @showbranchinfo="showbranchinfo"/>
      <WofflerPanel v-else
        class="wflbox"        
        :player="player"/>
    </v-card-text>
    <v-card-actions>
      <v-btn icon>
        <v-icon>favorite</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
.wflbox {
    width: 320px;
    height: 320px;
    border: 1px solid black
}

</style>

