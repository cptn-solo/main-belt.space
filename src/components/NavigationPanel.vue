<script>
import * as constants from '../state/constants'

export default {
  data: () => { return {
    constants
  }},
  methods: {
    toggleDarkTheme() {
      this.$emit('toggledarktheme')
    }    
  }
}
</script>
<template>
    <v-list>
    <v-list-tile to="/">
      <v-list-tile-action><v-icon>home</v-icon></v-list-tile-action>
      <v-list-tile-title>{{$t('navHome')}}</v-list-tile-title>
    </v-list-tile>
    <v-divider />
    <v-list-tile to="/about">
      <v-list-tile-action><v-icon>info</v-icon></v-list-tile-action>
      <v-list-tile-content>{{$t('navAbout')}}</v-list-tile-content>
    </v-list-tile>
    <v-divider/>
    <v-list-group prepend-icon="widgets" :value="true">
      <template v-slot:activator>
        <v-list-tile>
          <v-list-tile-content>{{$t('navGames')}}</v-list-tile-content>
        </v-list-tile>
      </template>
      <v-list-tile to="/woffler">
        <v-list-tile-action><v-icon>call_split</v-icon></v-list-tile-action>
        <v-list-tile-content>
            <v-list-item-title>Woffler Game</v-list-item-title>
            <v-list-tile-sub-title style="font-size: 7px;">{{constants.APP_NAME}}</v-list-tile-sub-title>
        </v-list-tile-content>        
      </v-list-tile>
    </v-list-group>
    <v-divider />
    <v-list-group prepend-icon="settings" :value="false">
      <template v-slot:activator>
        <v-list-tile>
          <v-list-tile-content>{{$t('navSettings')}}</v-list-tile-content>
        </v-list-tile>
      </template>
      <v-list-tile @click="toggleDarkTheme">
        <v-list-tile-action><v-icon>brightness_2</v-icon></v-list-tile-action>
        <v-list-tile-content>{{$t('navTheme')}}</v-list-tile-content>
      </v-list-tile>        
    </v-list-group>
  </v-list>
</template>