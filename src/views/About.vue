<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <v-flex shrink>
        <div class="outer-panel flex-column">
          <div class="inner-panel">
            <h1>About the project</h1>
            Tools and services for belters - games, exchange, gateways. Hub for those
            who knows.
            <VueShowdown :markdown="fileContent" class="blog-body"></VueShowdown>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import VueShowdown from "vue-showdown";
  import MarkDownData from '!!raw-loader!../assets/intro.md';

  export default {
    components: VueShowdown,
    data: function() {
      return {
        fileContent: null,
        rawContent: null
      };
    },
    created: function() {
      this.getContent();
    },
    methods: {
      getContent() {
        this.fileContent = MarkDownData;
      }
    }
  }
</script>
