<script>  
  export default {
    props: {
      branches: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      showMeta(idx) {
        this.$emit('showbranchinfo', idx)
      }      
    }
  }
</script>
<template>
  <v-list dense two-line>
    <v-list-tile v-for="(branch, idx) in branches"      
      :key="idx"
      @click="showMeta(idx)"> 
      <v-list-tile-content>
        <v-list-tile-title>
          <span>#{{branch.id}}</span>&nbsp;<span>{{branch.meta.name}}</span>
        </v-list-tile-title>
        <v-list-tile-sub-title>
          <span>{{$t('wflBranchStake')}}:</span><span>{{branch.totalstake}}</span>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action><v-btn icon ripple><v-icon small>info</v-icon></v-btn></v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

