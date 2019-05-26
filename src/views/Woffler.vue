<template>
  <div class="outer-panel flex-column">
    <div class="inner-panel">
      <v-card>
        <v-toolbar :color="bar.class" :dark="bar.dark">
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>Woffler game</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>favorite</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="wflbox">&nbsp;</div>
        </v-card-text>
        <v-card-actions>
          <v-btn icon>
            <v-icon>favorite</v-icon>
          </v-btn>
        </v-card-actions>        
      </v-card>
    </div>
  </div>
</template>
<script>

  export default {
    components: {},
    data: function() {
      return {
        bar: 
          // { 'class': '' },
           { 'class': '', dark: true },
          // { 'class': 'primary', dark: true },
          // { 'class': 'elevation-0' }        
      };
    },
    created: function() {
    },
    methods: {
    }
  }
</script>
<style>
.wflbox {
    width: 320px;
    height: 320px;
    border: 1px solid black
}
</style>

