<script>
import { mapState } from 'vuex';
export default {
  props: {
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
  data: () => ({}),
  computed: {
    ...mapState({
      branchInfo: state => state.woffler.selectedBranch
    })
  },
  methods: {
    startGame() {
      this.$emit('start', this.branchInfo)
    },
    hideInfo() {
      this.$emit('hideinfo')
    }
  }
}
</script>
<template>
  <v-card>
    <v-card-title>{{$t('wflBrMetaInfoTitle')}}</v-card-title>
    <v-card-text v-if="branchInfo && branchInfo.meta">
      <v-list subheader>
        <v-subheader>{{branchInfo.meta.name}}</v-subheader>
        <v-list-tile v-for="(row, idx) in rows" :key="idx">
          <v-list-tile-content>
            <v-list-tile-title>
              {{$t('wflBrMeta'+row[0])}}:&nbsp;<b>{{branchInfo.meta[row[0]]}}<span v-if="row[1] === '%'">&nbsp;%</span></b>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{$t('wflBrMeta'+row[0]+'h')}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn text @click="hideInfo" 
        color="secondary">{{$t('wflBrMetaCloseBtn')}}
      </v-btn>
      <v-btn text @click="startGame" v-if="branchInfo && branchInfo.meta"
        color="primary">{{$t('wflBrMetaPlayBtn')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

