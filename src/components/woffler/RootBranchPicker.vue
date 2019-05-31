<script>
  export default {
    props: {
      branches: {
        type: Array,
        default: () => []
      }
    },
    data:() => ({
    }),
}
</script>
<template>
  <v-list dense two-line>
    <v-list-tile v-for="(branch, idx) in branches" :key="idx">      
      <v-list-tile-content>
        <v-list-tile-title>
          <span>#{{branch.id}}</span>&nbsp;<span>{{branch.meta.name}}</span>
        </v-list-tile-title>
        <v-list-tile-sub-title>
          <span>{{$t('wflBranchStake')}}:</span><span>{{branch.totalstake}}</span>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action><v-icon>info</v-icon></v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

