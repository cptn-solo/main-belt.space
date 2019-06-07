const MAX_TRIES = 3
const PALYER_STATE = {
  INIT: 0, SAFE: 1, RED: 2, GREEN: 3, TAKE: 4
}

export default {
  computed: {
    canTry() {
      return this.player.levelresult === PALYER_STATE.SAFE
        && this.player.triesleft > 0
    },
    canCommitTry() {
      return this.player.levelresult === PALYER_STATE.SAFE
        && this.player.triesleft < MAX_TRIES
    },
    canNext() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && (!this.level.next || !this.level.next.locked)
    },
    canGoNext() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && (this.level.next && !this.level.next.locked)        
    },
    canSplit() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && !this.level.split
        && this.potSplittable
    },
    canTake() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && this.takeAmount
    },
    canClaimTake() {
      return this.showVesting && this.vestingReady
    },
    canUntake() {
      return this.player.levelresult === PALYER_STATE.TAKE          
    },
    canClaimRed() {
      return this.player.levelresult === PALYER_STATE.RED
        && (this.level.idparent > 0 || this.level.branch.meta.startjailed === 0)
    },
    canUnjail() {
      return this.player.levelresult === PALYER_STATE.RED
      && (this.level.idparent > 0 || this.level.branch.meta.startjailed != 0)
    },
    canClaimGreen() {
      return this.player.levelresult === PALYER_STATE.GREEN
    },
    canUnlockNext() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && this.level.next
        && this.level.next.locked
        && this.player.triesleft > 0
    },
    canUnlockSplit() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && this.level.split
        && this.level.split.locked
        && this.player.triesleft > 0
    },
    canSwitchToSplit() {
      return this.player.levelresult === PALYER_STATE.GREEN
        && this.level.split
        && !this.level.split.locked
    }    
  }
}