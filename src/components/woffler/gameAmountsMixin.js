import utils from '../../utils'

export default {
  computed: {
    takeAmount() {
      try {
        const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
        const tkrate = this.level.branch.meta.tkrate
        const potmin = parseFloat(this.level.branch.meta.potmin.split(' ')[0])

        const amount = utils.parseAmount((potbalance * tkrate) / 100)
        const remains = potbalance - amount

        return remains > potmin ? utils.asset(amount) : null
      } catch (error) {
        return null
      }
    },
    unjailAmount() {
      try {
        const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
        const unjlrate = this.level.branch.meta.unjlrate
        const unjlmin = parseFloat(this.level.branch.meta.unjlmin.split(' ')[0])

        const amount = utils.parseAmount((potbalance * unjlrate) / 100)
        const asset = utils.asset(Math.max(amount, unjlmin))
        return asset

      } catch (error) {
        return null
      }
    },
    nextPotAmount() {
      try {
        const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
        const nxtrate = this.level.branch.meta.nxtrate
        const potmin = parseFloat(this.level.branch.meta.potmin.split(' ')[0])

        const nxtPot = utils.parseAmount((potbalance * nxtrate) / 100)
        
        if (nxtPot < potmin)
          return utils.asset(potbalance)
        
        return utils.asset(nxtPot)

      } catch (error) {
        return null
      }
    },
    minSplittablePotAmount() {
      try {
        const spltrate = this.level.branch.meta.spltrate
        const stkrate = this.level.branch.meta.stkrate
        const stkmin = parseFloat(this.level.branch.meta.stkmin.split(' ')[0])
        
        const minSplitAmount = (stkmin * 100) / stkrate;
        const mitSplittablePotAmount = (minSplitAmount * 100) / spltrate;
        return mitSplittablePotAmount          
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    potSplittable() {
      const minsplittablepot = this.minSplittablePotAmount
      if (!minsplittablepot) return false

      const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
      
      if (potbalance >= minsplittablepot) return true

      return false
    },
    splitPotAmount() {
      try {
        const minsplittablepot = this.minSplittablePotAmount
        
        if (!minsplittablepot) return null

        const potbalance = parseFloat(this.level.potbalance.split(' ')[0])
        const spltrate = this.level.branch.meta.spltrate
        
        if (potbalance >= minsplittablepot) {
          const splitPot = utils.parseAmount((potbalance * spltrate) / 100)
          return utils.asset(splitPot)
        } else {
          console.log("Reward pot of the current level is too small, should be at least " + utils.asset(minsplittablepot))  
        }
        
        return null
        //"Reward pot of the current level is too small, should be at least " + mitSplittablePotAmount        
      } catch (error) {
        return null
      }
    },
  }
}