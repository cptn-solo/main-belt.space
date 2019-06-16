<script>
import { mapGetters, mapState } from 'vuex';
import { SubmitResourceChangeConfirm } from '../dialogs/userProfileConfirmations'
import utils from '../utils'
export default {
  data() {
    return {
      ramPrice: null,
      loading: null,
      activeTab: 0,
      cpuDiff: 0.0,
      netDiff: 0.0,
      ramDiff: 0.0,
    }
  },
  computed: {
    ...mapGetters('noscatter', {
      cpu: 'cpu',
      net: 'net',
      ram: 'ram'
    }),
    ...mapState({
      accountData: state => state.noscatter.blockchainAccount
    }),
    dialog: {
      get() {
        return this.$store.state.gui.resManagerDialog
      },
      set(val) {
        this.$store.dispatch('gui/showDialog', { key: 'resManagerDialog', payload: val })
      }
    },
    availableCPU() {
      if(!this.accountData) return 0;
      if(!this.accountData.self_delegated_bandwidth) return 0;
      return this.accountData.self_delegated_bandwidth.cpu_weight.split(' ')[0];
    },
    availableNET() {
      if(!this.accountData) return 0;
      if(!this.accountData.self_delegated_bandwidth) return 0;
      return this.accountData.self_delegated_bandwidth.net_weight.split(' ')[0];
    },    
    availableRAM() {
      return (this.accountData.ram_quota - this.accountData.ram_usage) / 1024
    },
    ramDiffPrice() {
      return this.asset(this.ramDiff * this.ramPrice * 1024)    
    },
    curCPU() {
      return this.asset(parseFloat(this.availableCPU) + parseFloat(this.cpuDiff))      
    },
    curNET() {
      return this.asset(parseFloat(this.availableNET) + parseFloat(this.netDiff))
    },
    curRAM() {
      return (parseFloat(parseFloat(this.availableRAM) + parseFloat(this.ramDiff))).toFixed(2)
    },

  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        this.ramPrice = await this.$store.dispatch('noscatter/getRamPrice')
        await this.$store.dispatch('noscatter/loadBlockchainAccount')        
      } catch (ex) {
        this.$dialog.error(ex)        
      } finally {
        this.loading = false
      }
    },
    changeRes(sign = 1) {
      const conv = (val, factor) => parseFloat((parseFloat(val) + (factor * sign))).toFixed(2)
      switch (this.activeTab) {
        case 0: { this.cpuDiff = conv(this.cpuDiff, 0.05); break;}
        case 1: { this.netDiff = conv(this.netDiff, 0.05); break;}
        case 2: { this.ramDiff = conv(this.ramDiff, 0.5); break;}
      }
    },
    asset(val) {
      return utils.asset(parseFloat(val))
    },
    async submitAction() {
      let loader
      
      if (!(await this.$dialog.confirm(new SubmitResourceChangeConfirm())))
        return      

      loader = this.$loading.show()      
      try {
        if (this.ramDiff > 0) {
          await this.$store.dispatch('noscatter/buyram', this.ramDiffPrice)
          this.ramDiff = 0
        } else if (this.ramDiff < 0) {
          await this.$store.dispatch('noscatter/sellram', this.ramDiff * -1024)
          this.ramDiff = 0
        }          
        
        if (this.cpuDiff > 0 || this.netDiff > 0) {
          await this.$store.dispatch('noscatter/delegateBW', { 
            net: this.netDiff > 0 ? this.asset(this.netDiff) : this.asset(0),
            cpu: this.cpuDiff > 0 ? this.asset(this.cpuDiff) : this.asset(0),
            })
          if (this.cpuDiff > 0) this.cpuDiff = 0
          else this.netDiff = 0
        }

        if (this.cpuDiff < 0 || this.netDiff < 0) {
          await this.$store.dispatch('noscatter/undelegateBW', { 
            net: this.netDiff < 0 ? this.asset(this.netDiff * (-1)) : this.asset(0),
            cpu: this.cpuDiff < 0 ? this.asset(this.cpuDiff * (-1)) : this.asset(0),
            })
          if (this.cpuDiff < 0) this.cpuDiff = 0
          else this.netDiff = 0
        }        

      } catch (ex) {
        this.$dialog.error(ex)
      } finally {
        if (loader) loader.hide()
      }
    }
  }
}
</script>
<template>
  <v-dialog v-model="dialog" max-width="300px">
    <v-card v-if="dialog">
      <v-card-title>
        <span>
        {{$t('upManageResPanelTitle')}}
        </span>
        <v-spacer />
        <v-btn style="margin-right: -6px" :loading="loading" :disabled="loading"
          @click="loadData" icon><v-icon>cached</v-icon></v-btn>
      </v-card-title>
      <v-divider/>
      <v-tabs
          v-model="activeTab"
          slider-color="yellow">
        <v-tab ripple>
          <span class="caption">cpu:</span><span class="value">{{ (cpu*100).toFixed(1)+'%' }}</span>&nbsp;
        </v-tab>
        <v-tab ripple>
          <span class="caption">net:</span><span class="value">{{ (net*100).toFixed(1)+'%' }}</span>&nbsp;
        </v-tab>
        <v-tab ripple>
          <span class="caption">ram:</span><span class="value">{{ (ram*100).toFixed(1)+'%' }}</span>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-layout row justify-space-between align-center>
          <v-btn flex icon @click="changeRes(-1)"><v-icon>remove</v-icon></v-btn>
          <div flex class="managingval">
            <template v-if="activeTab === 0">
              {{ curCPU }}
            </template>
            <template v-else-if="activeTab === 1">
              {{ curNET }}
            </template>
            <template v-else>
              {{ curRAM }} KB
            </template>
          </div>
          <v-btn flex icon @click="changeRes()"><v-icon>add</v-icon></v-btn>
        </v-layout>
        <div>
          <span v-if="cpuDiff != 0">cpu:{{asset(cpuDiff)}}&nbsp;</span>
          <span v-if="netDiff != 0">net:{{asset(netDiff)}}&nbsp;</span>
          <span v-if="ramDiff != 0">ram:{{ramDiffPrice}}&nbsp;</span>
        </div>
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
<style scoped>
.managingval {
  font-weight: bold;
  font-size: large;
}
.caption {
  font-size: small; color: gray;
}
.value {
  font-weight: normal
}
</style>