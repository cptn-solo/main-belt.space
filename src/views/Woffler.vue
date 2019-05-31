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
  <v-container pa-0>
    <v-layout>
      <v-flex>
        <v-dialog v-model="showBranchInfo">
          <BranchMetaPanel @start="startGame" @hideinfo="hideMeta"/>
        </v-dialog>
        <v-toolbar flat>
          <v-toolbar-title>Woffler game</v-toolbar-title>
          <v-spacer />
          <ReloadButton
            :loading="loading"
            @click="loadData"
          />
        </v-toolbar>
        <RootBranchPicker v-if="!player.levelresult"
          :branches="branches"
          @showbranchinfo="showbranchinfo"/>
        <WofflerPanel v-else
          class="wflbox"        
          :player="player"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style>
.wflbox {
    width: 200px;
    height: 200px;
    border: 1px solid black
}

</style>

