import { BranchSwitchConfirm, QuitGameConfirm, SignupAndBranchSwitchConfirm } from '../../dialogs/wofflerConfirmations'

export default {
  startGameAction: {
    icon: 'play_circle_outline', title: 'wflActionJoinGame', selector: 'woffler/joinGame',
    lock: true, confirm: new BranchSwitchConfirm()
    //add payload before use
  },
  quitGameAction: {
    icon: 'clear', title: 'wflActionJoinGame', selector: 'woffler/joinGame',
    lock: true, confirm: new QuitGameConfirm()
  },
  showRulesAction: { 
    icon: 'info_outline', title: 'wflActionShowRules', selector: 'woffler/selectLevel'
    //add payload before use
  },
  signupAdnJoinGameAction: {
    icon: 'person_add', title: 'wflActionSignupAndJoinGame', selector: 'woffler/signupAndJoinGame',
    lock: true, confirm: new SignupAndBranchSwitchConfirm()
    //add payload before use
  }
}