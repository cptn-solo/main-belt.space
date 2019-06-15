import utils from '../utils'

export default {
  compute(level, prev, next, branch, split, splitBranch, meta) {
    
    this.potbalance = level.potbalance
    const potbalanceAmount = utils.assetAmount(level.potbalance)

    this.splitbalance = split ? split.potbalance : null
    const splitbalanceAmount = split ? utils.assetAmount(split.potbalance) : 0

    const tkrate = meta.tkrate
    const nxtrate = meta.nxtrate
    const unjlrate = meta.unjlrate
    const buytryrate = meta.buytryrate
    const potmin = utils.assetAmount(meta.potmin)

    //minSplittablePotAmount:
    const spltrate = meta.spltrate
    const stkmin = utils.assetAmount(meta.stkmin)    
    this.minSplittablePotAmount = utils.parseAmount((stkmin * 100) / spltrate);

    this.prevPot = prev ? prev.potbalance : null
    this.prevPotAmount = prev ? utils.assetAmount(prev.potbalance) : 0

    this.currentPotAmount = potbalanceAmount
    this.currentPot = this.potbalance

    //potSplittable:
    this.potSplittable = this.currentPotAmount >= this.minSplittablePotAmount

    //nextPotAmount:
    this.nextPotCandidateAmount = next ? 0 : (this.currentPotAmount * nxtrate) / 100
    this.nextPotCandidate = utils.asset(this.nextPotCandidateAmount)

    this.nextPotAmount = next ? utils.assetAmount(next.potbalance) : 0
    this.nextPot = next ? next.potbalance : null

    //splitPotAmount:
    this.splitPotCandidateAmount = split ? 0 : !this.potSplittable ? 0 :
      (this.currentPotAmount * spltrate) / 100
    this.splitPotCandidate = utils.asset(this.splitPotCandidateAmount)

    this.splitPotAmount = split ? utils.assetAmount(split.potbalance) : 0
    this.splitPot = split ? split.potbalance : null
    
    //takeAmount:
    const takeAmount = this.getTakeAmount(meta, this.currentPotAmount, level.generation, branch.winlevgen)
    this.takeAmount = utils.asset(takeAmount)

    //unjailAmount:
    const unjailAmount = this.getUnjailPrice(meta, this.currentPotAmount, level.generation)
    this.unjailAmount = utils.asset(unjailAmount)

    //buyTryAmount:
    const buyTryAmount = this.getBuytryPrice(meta, this.currentPotAmount, level.generation)
    this.buyTryAmount = utils.asset(buyTryAmount)    

    return this
  },
  getTakeAmount(_meta, pot, generation, winlevgen) {
    if (_meta.maxlvlgen > 0 && _meta.maxlvlgen == generation)//last level winner gets all remaining pot
      return pot;

    let reward = (pot * _meta.tkrate) / 100;
    
    if(reward.amount > 0) return 0;

    if (_meta.takemult > 0) 
      reward *= (_meta.takemult * generation); 

    if (reward > pot)
      return pot;

    return reward;
  },
  getStakeThreshold(_meta, pot) {
    //stake amounts derived from total branch pot, not current level's amount
    let price = (pot * _meta.stkrate) / 100;
    const sktmin = utils.assetAmount(_meta.sktmin);
    if (price < stkmin)
      price = stkmin;

    return price;
  },
  getUnjailPrice(_meta, pot, generation) {
    let price = (pot * _meta.unjlrate) / 100;
    if (_meta.unljailmult > 0)
      price *= (_meta.unljailmult * generation);

    const unjlmin = utils.assetAmount(_meta.unjlmin);
    if (price < unjlmin)
      price = unjlmin;

    return price;
  },
  getBuytryPrice(_meta, pot, generation) {
    let price = (pot * _meta.buytryrate) / 100;
    if (_meta.buytrymult > 0) 
      price *= (_meta.buytrymult * generation);

    const buytrymin = utils.assetAmount(_meta.buytrymin);
    if (price < buytrymin)
      price = buytrymin;

    return price;
  }
}