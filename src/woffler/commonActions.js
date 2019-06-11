import { BranchSwitchConfirm, SignupAndBranchSwitchConfirm, BranchMetaModifyConfirm, BranchMetaRemoveConfirm } from '../dialogs/wofflerConfirmations'

export const commonActions = {
  unlockGameAction: {
    icon: 'lock_open', title: 'wflActionUnlockGame', selector: 'woffler/unlockRootLevel',
    lock: true
    //add payload before use
  },
  branchDialogAction: {
    icon: 'play_circle_outline', title: 'wflActionBranch', selector: 'gui/showDialog'    
    //add payload before use
  },
  branchAction: {
    icon: 'play_circle_outline', title: 'wflActionBranch', selector: 'woffler/createBranch',
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
  joinGameAction: {
    icon: 'play_circle_filled', title: 'wflActionJoinGame', selector: 'woffler/joinGame',
    lock: true, confirm: new BranchSwitchConfirm()
    //add payload before use
  },  
  showRulesAction: { 
    icon: 'info_outline', title: 'wflActionShowRules', selector: 'gui/showDialog'
    //add payload before use
  },
  modifyRulesAction: {
    icon: 'ballot', title: 'wflActionBranchMeta', selector: 'gui/showDialog'    
  },
  brnchmetaAction: {
    icon: 'ballot', title: 'wflActionBranch', selector: 'woffler/changeMeta',
    lock: true, confirm: new BranchMetaModifyConfirm()
    //add payload before use
  },
  deleteRulesAction: {
    icon: 'delete_forever', title: 'wflActionRmMeta', selector: 'woffler/deleteMeta',
    lock: true, confirm: new BranchMetaRemoveConfirm()
    //add payload before use
  },
  signupAdnJoinGameAction: {
    icon: 'person_add', title: 'wflActionSignupAndJoinGame', selector: 'woffler/signupAndJoinGame',
    lock: true, confirm: new SignupAndBranchSwitchConfirm()
    //add payload before use
  }
}