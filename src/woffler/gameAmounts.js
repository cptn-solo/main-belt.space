import utils from '../utils'

export default {
  compute(level, next, branch, split, splitBranch, meta) {
    
    const potbalanceAmount = utils.assetAmount(branch.potbalance)
    this.potbalance = branch.potbalance

    const splitbalanceAmount = split && splitBranch ? 
      utils.assetAmount(splitBranch.potbalance) : 0
    this.splitbalance = splitBranch ? splitBranch.potbalance : null

    const tkrate = meta.tkrate
    const nxtrate = meta.nxtrate
    const unjlrate = meta.unjlrate
    const buytryrate = meta.buytryrate
    const potmin = utils.assetAmount(meta.potmin)

    //minSplittablePotAmount:
    const spltrate = meta.spltrate
    const stkmin = utils.assetAmount(meta.stkmin)    
    this.minSplittablePotAmount = 
      utils.parseAmount((stkmin * 100) / spltrate);

    const gap = branch.winlevgen - level.generation //current level gap from last level
    const tail = 1 - (nxtrate/100) //left behind the next level
    const tailWeight = Math.pow(tail, gap) //ratio to produce tail for given level dept from total pot balance

    this.prevPotAmount = level.generation < 2 ? 0 :
      potbalanceAmount * tailWeight * tail
    this.prevPot = utils.asset(this.prevPotAmount)

    this.currentPotAmount = 
      potbalanceAmount * tailWeight - 
        (level.generation > 1 ? this.prevPotAmount : 0)
    this.currentPot = utils.asset(this.currentPotAmount)

    //potSplittable:
    this.potSplittable = this.currentPotAmount >= this.minSplittablePotAmount

    //nextPotAmount:
    this.nextPotCandidateAmount = next ? 0 : 
      (this.currentPotAmount * nxtrate) / 100
    this.nextPotCandidate = utils.asset(this.nextPotCandidateAmount)

    this.nextPotAmount = !next ? 0 :
      (potbalanceAmount * tailWeight / tail) - this.currentPotAmount - this.prevPotAmount
    this.nextPot = utils.asset(this.nextPotAmount)

    //splitPotAmount:
    this.splitPotCandidateAmount = split ? 0 : !this.potSplittable ? 0 :
      utils.parseAmount((this.currentPotAmount * spltrate) / 100)
    this.splitPotCandidate = utils.asset(this.splitPotCandidateAmount)

    this.splitPotAmount = !(split && splitBranch) ? 0 :
      (splitbalanceAmount * Math.pow((100 - nxtrate)/100, splitBranch.winlevgen - split.generation))
    this.splitPot = utils.asset(this.splitPotAmount)
    
    //takeAmount:
    const takeAmount = utils.parseAmount((potbalanceAmount * tkrate) / 100)
    const remains = potbalanceAmount - takeAmount
    this.takeAmount = remains > potmin ? utils.asset(takeAmount) : null

    //unjailAmount:
    const unjlmin = utils.assetAmount(meta.unjlmin)
    const unjailAmount = utils.parseAmount((this.currentPotAmount * unjlrate) / 100)
    this.unjailAmount = utils.asset(Math.max(unjailAmount, unjlmin))

    //buyTryAmount:
    const buytrymin = utils.assetAmount(meta.buytrymin)

    const buyTryAmount = utils.parseAmount((this.currentPotAmount * buytryrate) / 100)
    this.buyTryAmount = utils.asset(Math.max(buyTryAmount, buytrymin))    

    return this
  }
}