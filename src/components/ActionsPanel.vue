<script>
import { mapState } from 'vuex';
  export default {
    data: () => ({
      sheet: false,      
    }),
    computed: {
      ...mapState({
        pendingActions: state => state.engine.pendingGUIActions,
      })
    },
    watch: {
      pendingActions(n, o) {
        this.sheet = (n.length > 0)
      },
      sheet(n, o) {
        if (!n)
          this.$store.dispatch('engine/requestActions', [])
      }
    },
    methods: {
      async actionSelected(idx) {
        this.$emit('action', idx)
        const action = this.pendingActions[idx]
        let loader
        
        if (action.confirm && !(await this.$dialog.confirm(action.confirm)))
          return

        if (action.lock) loader = this.$loading.show()

        this.$ga.event('action', action.title, '--', 1)

        try {
          await this.$store.dispatch('engine/actionPicked', idx)
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
      <!-- <template v-slot:activator>
        <v-btn
          color="purple"
          dark
        >
          Click me
        </v-btn>
      </template> -->
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