import utils from '../utils'
const MAX_TRIES = 3
const PALYER_STATE = {
  INIT: 0, SAFE: 1, RED: 2, GREEN: 3, TAKE: 4, NEXT: 5, SPLIT: 6
}

export default {
  compute(player, level, next, split, branch, splitBranch, meta, amounts) {
    
    const closedBranch = (branch.closed != 0)
    const closedSplit = splitBranch ? splitBranch.closed != 0 : false

    this.branchClosed = closedBranch
    this.splitClosed = closedSplit

    this.canTry = !closedBranch
      && player.status === PALYER_STATE.SAFE
      && player.triesleft > 0

    this.canCommitTry = !closedBranch
      && player.status === PALYER_STATE.SAFE
      && player.triesleft < MAX_TRIES
    
    this.canNext = !closedBranch
      && player.status === PALYER_STATE.GREEN
      && (!next || next.locked)
    
    this.canGoNext = !closedBranch
      && player.status === PALYER_STATE.GREEN
      && (next && !next.locked)    

    this.canSplit = player.status === PALYER_STATE.GREEN
      && ((!split && amounts.potSplittable && !closedBranch) ||
          (split && split.locked && !closedSplit))

    this.canTake = !closedBranch
      && player.status === PALYER_STATE.GREEN
      && amounts.takeAmount
    
    this.canUntake = !closedBranch
      && player.status === PALYER_STATE.TAKE
    
    this.canClaimRed = !closedBranch
      && player.status === PALYER_STATE.RED
      && (level.idparent > 0 || meta.startjailed === 0)
    
    this.canUnjail = !closedBranch
      && player.status === PALYER_STATE.RED      
      && (level.idparent > 0 || meta.startjailed != 0)
    
    this.canClaimSafe = !closedBranch && (
      player.status === PALYER_STATE.GREEN ||
      player.status === PALYER_STATE.NEXT ||
      player.status === PALYER_STATE.SPLIT
    )
    
    this.canUnlockNext = !closedBranch
      && player.status === PALYER_STATE.NEXT
      && next && next.locked
      && player.triesleft > 0

    this.canUnlockSplit = !closedSplit
      && player.status === PALYER_STATE.SPLIT
      && split && split.locked
      && player.triesleft > 0

    this.canSwitchToSplit = !closedSplit
      && player.status === PALYER_STATE.GREEN
      && split && !split.locked

    this.canBuyTries = (
      (player.status === PALYER_STATE.NEXT && !closedBranch) ||
      (player.status === PALYER_STATE.SPLIT && !closedSplit)
    ) && player.triesleft === 0

    return this
  } 
}