import { mapState } from "vuex";
import utils from '../../utils'

export default {
  data(){
    return {
      vestingReady: false,
      interval: null
    }    
  },
  computed: {
    ...mapState({
      player: state => state.userProfile.player,
    }),
    showVesting() {
      return this.player && this.player.status === 4 ? (utils.assetAmount(this.player.vestingbalance) > 0) : false
    },
    vestingDate() {
      return this.player && this.showVesting ? this.player.resulttimestamp*1000 : null
    }
  },
  created() {
    this.initVestingInterval()
  },
  destroyed() {
    clearInterval(this.interval)
  },
  watch: {
    vestingDate(n, o) {
      if (!n)
        clearInterval(this.interval)
      else
        this.initVestingInterval()
    }
  },
  methods: {
    initVestingInterval() {
        const now = Date.now()
        const vesting = this.vestingDate
        if (vesting && vesting > now) {
          this.vestingReady = false
          const diff = vesting - now
          this.interval = setInterval(() => {
            this.vestingReady = true
            clearInterval(this.interval)              
          }, diff)
        } else if (vesting && vesting < now) {
          this.vestingReady = true
        } else {
          this.vestingReady = false
          clearInterval(this.interval)
        }
      }
    },
  }