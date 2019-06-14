import utils from '../utils'
const MAX_TRIES = 3
const PALYER_STATE = {
  INIT: 0, SAFE: 1, RED: 2, GREEN: 3, TAKE: 4, NEXT: 5, SPLIT: 6
}

export default {
  compute(player, level, next, split, meta, amounts) {
    this.canTry = player.status === PALYER_STATE.SAFE
      && player.triesleft > 0

    this.canCommitTry = player.status === PALYER_STATE.SAFE
      && player.triesleft < MAX_TRIES
    
    this.canNext = player.status === PALYER_STATE.GREEN
      && (!next || next.locked)
    
    this.canGoNext = player.status === PALYER_STATE.GREEN
      && (next && !next.locked)
    this.canSplit = player.status === PALYER_STATE.GREEN
      && ((!split && amounts.potSplittable) ||
          (split && split.locked))

    this.canTake = player.status === PALYER_STATE.GREEN
      && amounts.takeAmount
    
    this.canUntake = player.status === PALYER_STATE.TAKE 
    
    this.canClaimRed = player.status === PALYER_STATE.RED
      && (level.idparent > 0 || meta.startjailed === 0)
    
    this.canUnjail = player.status === PALYER_STATE.RED
      && (level.idparent > 0 || meta.startjailed != 0)
    
    this.canClaimSafe = player.status === PALYER_STATE.GREEN ||
      player.status === PALYER_STATE.NEXT ||
      player.status === PALYER_STATE.SPLIT
    
    this.canUnlockNext = player.status === PALYER_STATE.NEXT
      && next && next.locked
      && player.triesleft > 0

    this.canUnlockSplit = player.status === PALYER_STATE.SPLIT
      && split && split.locked
      && player.triesleft > 0

    this.canSwitchToSplit = player.status === PALYER_STATE.GREEN
      && split && !split.locked

    this.canBuyTries = (player.status === PALYER_STATE.NEXT ||
      player.status === PALYER_STATE.SPLIT) &&
      player.triesleft === 0

    return this
  } 
}