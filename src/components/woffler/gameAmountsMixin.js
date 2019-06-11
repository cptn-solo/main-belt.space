import utils from '../../utils'

export default {
  computed: {
    takeAmount() {
      try {
        const potbalance = utils.assetAmount(this.level.potbalance)
        const tkrate = this.level.branch.meta.tkrate
        const potmin = utils.assetAmount(this.level.branch.meta.potmin)

        const amount = utils.parseAmount((potbalance * tkrate) / 100)
        const remains = potbalance - amount

        return remains > potmin ? utils.asset(amount) : null
      } catch (error) {
        return null
      }
    },
    unjailAmount() {
      try {
        const potbalance = utils.assetAmount(this.level.potbalance)
        const unjlrate = this.level.branch.meta.unjlrate
        const unjlmin = utils.assetAmount(this.level.branch.meta.unjlmin)

        const amount = utils.parseAmount((potbalance * unjlrate) / 100)
        const asset = utils.asset(Math.max(amount, unjlmin))
        return asset

      } catch (error) {
        return null
      }
    },
    buyTryAmount() {//canBuyTries
      try {
        const potbalance = utils.assetAmount(this.level.potbalance)
        const buytryrate = this.level.branch.meta.buytryrate
        const buytrymin = utils.assetAmount(this.level.branch.meta.buytrymin)

        const amount = utils.parseAmount((potbalance * buytryrate) / 100)
        const asset = utils.asset(Math.max(amount, buytrymin))
        return asset

      } catch (error) {
        return null
      }
    },
    nextPotAmount() {
      try {
        const potbalance = utils.assetAmount(this.level.potbalance)
        const nxtrate = this.level.branch.meta.nxtrate
        const potmin = utils.assetAmount(this.level.branch.meta.potmin)

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
        const stkmin = utils.assetAmount(this.level.branch.meta.stkmin)
        
        const mitSplittablePotAmount = (stkmin * 100) / spltrate;
        return mitSplittablePotAmount          
      } catch (ex) {
        console.log(ex)
        return null
      }
    },
    potSplittable() {
      const minsplittablepot = this.minSplittablePotAmount
      if (!minsplittablepot) return false

      const potbalance = utils.assetAmount(this.level.potbalance)
      
      if (potbalance >= minsplittablepot) return true

      return false
    },
    splitPotAmount() {
      try {
        const minsplittablepot = this.minSplittablePotAmount
        
        if (!minsplittablepot) return null

        const potbalance = utils.assetAmount(this.level.potbalance)
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