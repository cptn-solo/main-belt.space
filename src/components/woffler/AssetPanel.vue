<script>
import * as constants from '../../state/constants'
import ApplicationError from '../../dialogs/applicationError'
import utils from '../../utils'
import { mapState } from 'vuex';
export default {
  props: {
    placeholder: { type: String, default: "" },
    guiKey: { type: String, default: ""}
  },
  data: () => ({
    constants,    
    amount: null,
  }),
  computed: {
    ...mapState({
      action: (state) => state.gui.payload,
      minValue: (state) => state.gui.props ? state.gui.props.min : null,
      maxValue: (state) => state.gui.props ? state.gui.props.max : null,
    }),
    dialog: {
      get() { return this.$store.state.gui[this.guiKey] },
      set() { 
        this.$store.dispatch('gui/showDialog', { key: this.guiKey, payload: null, props: null }) 
        this.amount = null
      }
    },
    amountRules() {
      const arr = [value => {
        const pattern = /^[0-9]{1,10}(\.[0-9]{1,4})?$/
        return pattern.test(value) || 'invalid amount'
      }]

      if (this.minValue) 
        arr.push(value => { return parseFloat(value) >= this.minValue || 'min. '+utils.asset(this.minValue) })
      
      if (this.maxValue) 
        arr.push(value => { return parseFloat(value) <= this.maxValue || 'max. '+utils.asset(this.maxValue) })
      
      console.log(arr)
      
      return arr
    }

  },
  methods: {
    submitAction () {      
      const amount = utils.parseAmount(this.amount)
      if (amount > 0) {
        const asset = utils.asset(amount)
        let targetAction = Object.assign({}, this.action)
        if (this.action.payload) {//pre-set params exist for target action
          const payload = Object.assign({}, this.action.payload, { amount: asset})
          targetAction = Object.assign(targetAction, { payload })
        } else { //no pre-set params exist for target action
          targetAction = Object.assign(targetAction, { payload: asset })
        }        
        targetAction.confirm.setAsset(asset)
        this.$store.dispatch('engine/enqueueAction', targetAction)
        this.dialog = false
      }
    },
    setMinValue() {
      this.amount = this.minValue
    },
    setMaxValue() {
      this.amount = this.maxValue
    }
  }    
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="300px">
    <v-card v-if="dialog">
      <v-card-title><slot name="title"/></v-card-title>
      <v-divider/>
      <v-card-text>
        <VTextField
          style="width: 100%"
          v-model="amount"
          name="amount"
          :rules="amountRules"
          :placeholder="placeholder"
          :suffix="constants.CURR_CODE"
        />
        <v-btn flat small v-if="minValue"
          @click="setMinValue">min. {{minValue}}</v-btn>
        <v-btn flat small v-if="maxValue"
          @click="setMaxValue">max. {{maxValue}}</v-btn>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer />
        <v-btn small outline
          @click="dialog = false">{{$t('miskCacel')}}</v-btn>
        <v-btn small color="primary"
          @click="submitAction">{{$t('miskProceed')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>    
</template>
