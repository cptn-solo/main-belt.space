<script>  
  import { BranchSwitchConfirm } from '../../dialogs/wofflerConfirmations'
  export default {
    props: {
      startLevels: {
        type: Array,
        default: () => ([])
      },
      startAction: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      showMeta(idx) {
        this.$emit('showlvlinfo', idx)                  
      },
      showActions(idx) {
        const payload = this.startLevels[idx]
        const startGameAction = Object.assign(this.startAction, { payload })
        const showRulesAction = { icon: 'info_outline', title: 'wflActionShowRules', 
          selector: 'woffler/selectLevel', payload
        }
        const actions = [startGameAction, showRulesAction]
        this.$store.dispatch('engine/requestActions', actions)
      }
    }
  }
</script>
<template>
  <v-list dense two-line>
    <v-list-tile v-for="(level, idx) in startLevels"      
      :key="idx"
      @click="showActions(idx)"
      ripple> 
      <v-list-tile-content>
        <v-list-tile-title>
          <span>#{{level.branch.id}}</span>&nbsp;<span>{{level.branch.meta.name}}</span>          
        </v-list-tile-title>
        <v-list-tile-sub-title>
          <span>{{$t('wflBranchStake')}}:&nbsp;{{level.branch.totalstake}}</span>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon ripple @click.stop="showMeta(idx)">
          <v-icon small>info</v-icon>
        </v-btn>        
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

