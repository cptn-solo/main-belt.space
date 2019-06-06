<template>
<v-container>
    <VueShowdown :markdown="fileContent" class="markdown"/>
</v-container>
</template>
<script>
  import VueShowdown from "vue-showdown";
  import MarkDownData from '!!raw-loader!../../assets/woffler_en.md';

  export default {
    components: VueShowdown,
    data: () => { return { fileContent: null }},
    created() {
      this.fileContent = MarkDownData
    },
  }
</script>
<style scoped>
.markdown {
    text-align: justify;
    padding: 10px;

}
</style>
