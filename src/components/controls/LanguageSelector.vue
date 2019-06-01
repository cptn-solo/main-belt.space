<script>
import { mapState, mapGetters } from 'vuex';
export default {
  data: () => ({}),
  computed: {
    ...mapState({
      selectedLocale: state => state.settings.selectedLocale,
    }),
    ...mapGetters('settings', {
      availableLocales: 'availableLocales'
    })
  },
  methods: {
    selectLocale(loc) {
      this.$store.dispatch('settings/setSelectedLocale', loc)
    }
  } 
}
</script>
<template>
  <v-menu>
    <template slot="activator">
      <img :src="selectedLocale.flagImg" style="width: 22px; margin-left: 5px">
    </template>
    <v-list>
      <v-list-tile v-for="(loc, idx) in availableLocales" :key="idx"
        @click="selectLocale(loc)">
        <v-list-tile-avatar>
          <img :src="loc.flagImg">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{loc.title}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>  
</template>
