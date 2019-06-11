<script>
import utils from '../../../utils'
export default {
  props: {
    value: { type: Object, default: () => ({ key: null, type: 'text', val: null }) }
  },
  data: () => {
    return {
      fieldVal: null,
      amountRules: [
        value => {
          const pattern = /^[0-9]{1,10}(\.[0-9]{1,4})?$/
          return pattern.test(value) || 'invalid amount'
        },
      ],
      percentRules: [
        value => {
          const pattern = /^((\d{0,1}[0-9](\.\d{0,1}[0-9])?)|(100))$/
          return pattern.test(value) || 'invalid percent'
        },
      ],
      intRules: [],
      valueType: null,
      valueLimit: null,
      maxLength: null,
    }
  },
  mounted() {    
    this.setupField(this.value)    
  },
  methods: {
    setupField(value) {
      this.fieldVal = value.val
      const parts = value.type.split(' ')
      this.valueType = parts && parts.length > 1 ? parts[0] : value.type
      this.valueLimit = parts && parts.length > 1 ? parseInt(parts[1]) : null
      this.maxLength = this.valueType === 'text' ? this.valueLimit : null
      this.intRules = [
        value => { return parseInt(value) <= this.valueLimit || 'reds and greens together cant exceed '+this.valueLimit }
      ]
    }
  },
  computed: {
    isCounter() {
      return !!this.maxLength
    },
    suffix() {
      switch (this.value.type) {
        case '%':
          return '%'          
        case 'interval':
          return this.$t('miskSeconds')
        case 'asset':
          return this.value.val.split(' ')[1]
        default:
          return null;
      }
    },
    rules() {
      switch (this.valueType) {
        case '%':
          return this.percentRules
        case 'asset':
          return this.amountRules
        case 'int': {
          return this.intRules
        }          
        default:
          return []
      }
    },
    val: {
      get() {
        switch (this.valueType) {
          case 'asset':
            return utils.assetAmount(this.fieldVal)                    
          default:
            return this.fieldVal;
        }
      },
      set(n) {
        switch (this.valueType) {
          case 'asset':
            this.fieldVal = utils.asset(utils.parseAmount(n))
            break
          default:
            this.fieldVal = n
        }
      }
    }
  },
  watch: {
    value(n) {
      this.setupField(n)    
    },    
    fieldVal(n) {
      const value = this.valueType === 'int' ? parseInt(n) : n
      this.$emit('changed', { key: this.value.key, value})
    }
  },  
}
</script>

<template>
  <div>
    <v-switch v-if="valueType === 'bool'" v-model="val"
      :label="$t('wflBrMeta'+value.key)" />
    <v-text-field v-else v-model="val"
      :label="$t('wflBrMeta'+value.key)"
      :suffix="suffix"
      :rules="rules"
      :counter="isCounter"
      :maxlength="maxLength"   
      :hint="$t('wflBrMeta'+value.key+'h')"
    />
    {{valueLimit}}
  </div>  
</template>
