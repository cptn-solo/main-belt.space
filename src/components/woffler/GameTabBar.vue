<script>
export default {
  props: {
    hasActiveGame: {
      type: Boolean,
      default: false
    }
  },
  data:() => ({
    tabs: [{title: 'wflInfoTabTitle', key: 'info'}],
    activeTab: null
  }),
  created() {
    this.prepareTabs()
  },
  watch: {
    hasActiveGame(n, o) {
      this.prepareTabs();
    },
    activeTab(n, o) {
      this.$emit(n.key)
    }
  },
  methods: {
    prepareTabs() {
      if (!this.tabs.find(t => t.key === 'levels'))
        this.tabs.push({title: 'wflStartBranchesTabTitle', key: 'levels'})
      
      const activeIdx = this.tabs.findIndex(t => t.key === 'active')
      if (hasActiveGame) {
        if (activeIdx < 0)
          this.tabs.push({title: 'wflActiveGameTabTitle', key: 'active'})
      } else {
        if (activeIdx >= 0)
          this.tabs.splice(activeIdx,1)
      }
    }
  }
}
</script>

<template>
  <v-tabs
    v-model="activeTab"
    slider-color="yellow"
  >
    <v-tab
      v-for="(tab,idx) in tabs"
      :key="idx"
      ripple
    >
      {{$t(tab.title)}}
    </v-tab>
  </v-tabs>
</template>
