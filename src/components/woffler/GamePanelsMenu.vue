<script>
  export default {
    props: {
      panels: { type: Array, default: () => [] }
    },
  }
</script>

<template>
  <v-menu>
    <template slot="activator">
      <v-btn icon ripple>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <template v-for="panel in panels">
        <v-list-tile :key="panel.key" :to="'/woffler/'+panel.key">
          <v-list-tile-action><v-icon v-text="panel.aicon"/></v-list-tile-action>
          <v-list-tile-title>{{$t(panel.atitle)}}</v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>
