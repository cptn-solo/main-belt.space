<script>
import { mapState } from 'vuex';
export default {
  props: {
    action: {
      type: Object,
      default: null
    },
    payload: {
      type: Object,
      default: null
    },
    icon: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState({
      currentGUIAction: (state) => state.engine.currentGUIAction
    }),
    loading() {
      return this.currentGUIAction && this.currentGUIAction.key === this.action.key
    },
    disabled() {
      return !!this.currentGUIAction 
    }
  },
  methods: {
    onclick() {      
      if (this.loading) return
      
      this.$store.dispatch('engine/enqueueAction', {
        title: this.action.key, key: this.action.key, selector: 'woffler/playerAction',
        payload: { 
          actionname: this.action.name || this.action.key , 
          payload: this.payload
        }
      })
    },    
  }
}
</script>
<template>
  <div class="buttonpanel">
    <template v-if="icon">
      <v-btn 
        icon ripple style="margin: 0px"
        :class="action.key + 'btn'" 
        :loading="loading" :disabled="disabled" 
        @click="onclick">
        <v-icon>{{ icon }}</v-icon>
      </v-btn><br>
      <span class="caption">
        <slot name="caption" />
      </span>
    </template>
    <template v-else>
      <v-btn fab :class="action.key + 'btn'" :loading="loading" :disabled="disabled" @click="onclick">
        <slot name="text" />
      </v-btn><br>
      <span class="caption">
        <slot name="caption" />
      </span>
    </template>
  </div>    
</template>
<style scoped>
  .caption { font-size: smaller; color: gray }
  .buttonpanel { line-height: 10px }
</style>