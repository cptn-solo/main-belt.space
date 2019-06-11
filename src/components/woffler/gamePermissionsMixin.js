const MAX_TRIES = 3
const PALYER_STATE = {
  INIT: 0, SAFE: 1, RED: 2, GREEN: 3, TAKE: 4, NEXT: 5, SPLIT: 6
}

export default {
  computed: {
    canTry() {
      return this.player.status === PALYER_STATE.SAFE
        && this.player.triesleft > 0
    },
    canCommitTry() {
      return this.player.status === PALYER_STATE.SAFE
        && this.player.triesleft < MAX_TRIES
    },
    canNext() {
      return this.player.status === PALYER_STATE.GREEN
        && (!this.level.next || this.level.next.locked)
    },
    canGoNext() {
      return this.player.status === PALYER_STATE.GREEN
        && (this.level.next && !this.level.next.locked)        
    },
    canSplit() {
      return this.player.status === PALYER_STATE.GREEN
        && (
          (!this.level.split && this.potSplittable) ||
          (this.level.split && this.level.split.locked)
        )
    },
    canTake() {
      return this.player.status === PALYER_STATE.GREEN
        && this.takeAmount
    },
    canClaimTake() {
      return this.showVesting && this.vestingReady
    },
    canUntake() {
      return this.player.status === PALYER_STATE.TAKE          
    },
    canClaimRed() {
      return this.player.status === PALYER_STATE.RED
        && (this.level.idparent > 0 || this.level.branch.meta.startjailed === 0)
    },
    canUnjail() {
      return this.player.status === PALYER_STATE.RED
      && (this.level.idparent > 0 || this.level.branch.meta.startjailed != 0)
    },
    canClaimSafe() {
      return this.player.status === PALYER_STATE.GREEN ||
        this.player.status === PALYER_STATE.NEXT ||
        this.player.status === PALYER_STATE.SPLIT
    },
    canUnlockNext() {
      return this.player.status === PALYER_STATE.NEXT
        && this.level.next
        && this.level.next.locked
        && this.player.triesleft > 0
    },
    canUnlockSplit() {
      return this.player.status === PALYER_STATE.SPLIT
        && this.level.split
        && this.level.split.locked
        && this.player.triesleft > 0
    },
    canSwitchToSplit() {
      return this.player.status === PALYER_STATE.GREEN
        && this.level.split
        && !this.level.split.locked
    },
    canBuyTries() {
      return (this.player.status === PALYER_STATE.NEXT ||
        this.player.status === PALYER_STATE.SPLIT) &&
        this.player.triesleft === 0
    }
  }
}