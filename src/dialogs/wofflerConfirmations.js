import ApplicationDialog from './applicationDialog'

export class BranchSwitchConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflJoinGameConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflJoinGameConfirmText'),
    })
  }
}

export class QuitGameConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflQuitGameConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflQuitGameConfirmText'),
    })
  }
}

export class SignupAndBranchSwitchConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflSignupAndJoinGameConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflSignupAndJoinGameConfirmText'),
    })
  }
}