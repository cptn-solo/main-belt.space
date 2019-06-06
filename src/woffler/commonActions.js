import { BranchSwitchConfirm, SignupAndBranchSwitchConfirm } from '../dialogs/wofflerConfirmations'

export const commonActions = {
  unlockGameAction: {
    icon: 'lock_open', title: 'wflActionUnlockGame', selector: 'woffler/unlockRootLevel',
    lock: true
    //add payload before use
  },
  addStakeDialogAction: {
    icon: 'attach_money', title: 'wflActionAddStake', selector: 'gui/showDialog'    
    //add payload before use
  },
  addStakeAction: {
    icon: 'attach_money', title: 'wflActionAddStake', selector: 'userProfile/addBranchStake',
    lock: true
    //add payload before use
  },
  startGameAction: {
    icon: 'play_circle_outline', title: 'wflActionJoinGame', selector: 'woffler/joinGame',
    lock: true, confirm: new BranchSwitchConfirm()
    //add payload before use
  },
  showRulesAction: { 
    icon: 'info_outline', title: 'wflActionShowRules', selector: 'gui/showDialog'
    //add payload before use
  },
  signupAdnJoinGameAction: {
    icon: 'person_add', title: 'wflActionSignupAndJoinGame', selector: 'woffler/signupAndJoinGame',
    lock: true, confirm: new SignupAndBranchSwitchConfirm()
    //add payload before use
  }
}