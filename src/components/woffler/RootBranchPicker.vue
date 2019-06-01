<script>  
  export default {
    props: {
      startLevels: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      showMeta(idx) {
        this.$emit('showlvlinfo', idx)
      }      
    }
  }
</script>
<template>
  <v-list dense two-line>
    <v-list-tile v-for="(level, idx) in startLevels"      
      :key="idx"
      @click="showMeta(idx)"
      ripple> 
      <v-list-tile-content>
        <v-list-tile-title>
          <span>#{{level.branch.id}}</span>&nbsp;<span>{{level.branch.meta.name}}</span>          
        </v-list-tile-title>
        <v-list-tile-sub-title>
          <span>{{$t('wflBranchStake')}}:&nbsp;{{level.branch.totalstake}}</span>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon ripple><v-icon small>info</v-icon></v-btn>        
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

