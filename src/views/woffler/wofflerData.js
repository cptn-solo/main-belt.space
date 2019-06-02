import { BranchSwitchConfirm, QuitGameConfirm, SignupAndBranchSwitchConfirm } from '../../dialogs/wofflerConfirmations'

export default {
  gamePanels: [
    { key: 'info', ttitle: 'wflInfoPanelTitle', atitle: 'wflInfoActionTitle', aicon: 'help_outline' },
    { key: 'levels', ttitle: 'wflStartBranchesPanelTitle', atitle: 'wflStartBranchesActionTitle', aicon: 'list' },
    { key: 'active', ttitle: 'wflActiveGamePanelTitle', atitle: 'wflActiveGameActionTitle', aicon: 'videogame_asset', hidden: true }
  ],
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