<script>
import { mapState } from 'vuex';
  export default {
    data: () => ({
      sheet: false,      
    }),
    computed: {
      ...mapState({
        pendingActions: state => state.engine.pendingGUIActions,
        currentAction: state => state.engine.currentGUIAction,
      })
    },
    watch: {
      pendingActions(n, o) {
        this.sheet = (n.length > 0)
      },
      currentAction(n, o) {
        if(n) this.processAction(n)
      },
      sheet(n, o) {
        if (!n)
          this.$store.dispatch('engine/requestActions', [])
      }
    },
    methods: {
      actionSelected(idx) {
          this.$store.dispatch('engine/actionPicked', idx)
      },
      async processAction(action) {
        let loader
        
        if (action.confirm && !(await this.$dialog.confirm(action.confirm))) {
          this.$store.dispatch('engine/enqueueAction', null)
          return
        }

        if (action.lock) loader = this.$loading.show()

        this.$ga.event('action', action.title, '--', 1)

        try {          
          await this.$store.dispatch('engine/performEnqueuedAction')
        } catch (ex) {
          this.$dialog.error(ex)
        }

        if (loader) loader.hide()
      }
    }
  }
</script>
<template>
  <div class="text-xs-center">
    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-subheader>Actions</v-subheader>
        <v-list-tile
          v-for="(action,idx) in pendingActions"
          :key="idx"
          @click="actionSelected(idx)"
        >
          <v-list-tile-action>
            <v-icon v-text="action.icon" />
          </v-list-tile-action>
          <v-list-tile-title>{{ $t(action.title) }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>