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
  <v-list dense>
    <v-list-tile v-for="(branch, idx) in branches" :key="idx">
      <span>{{branch.id}}</span>
      <span>{{branch.idmeta}}</span>
      <span>{{branch.totalstake}}</span>
    </v-list-tile>
  </v-list>
</template>

