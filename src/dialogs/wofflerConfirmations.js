import ApplicationDialog from './applicationDialog'

export class BranchSwitchConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflJoinGameConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflJoinGameConfirmText'),
    })
  }
}

export class AddStakeConfirm extends ApplicationDialog {
  constructor(params = []) {
    super({ titleLocalized: ApplicationDialog.t('wflAddStakeConfirmTitle') })
    this.params = params
  }
  setAsset(asset) {
    this.params.push(asset)
    this.text = ApplicationDialog.t('wflAddStakeConfirmText', this.params)
  }  
}

export class CreateNewGamePrompt extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflCreateBranchPromptTitle'),
      textLocalized: ApplicationDialog.t('wflCreateBranchPromptText'),
    })
  }
}

export class CreateBranchConfirm extends ApplicationDialog {
  constructor(params = []) {
    super({ titleLocalized: ApplicationDialog.t('wflCreateBranchConfirmTitle') })
    this.params = params
  }
  setAsset(asset) {
    this.params.push(asset)
    this.text = ApplicationDialog.t('wflCreateBranchConfirmText', this.params)
  }  
}

export class BranchMetaModifyConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflModifyMetaConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflModifyMetaConfirmText'),
    })
  }
}

export class BranchMetaRemoveConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflRemoveMetaConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflRemoveMetaConfirmText'),
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

export class LoginRequiredWarning extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflLoginRequiredWarningTitle'),
      textLocalized: ApplicationDialog.t('wflLoginRequiredWarningText'),
      actions: {
        falseLocalized: ApplicationDialog.t('miskOk')
      }
    })
  }
}

export class ClosedBranchWarning extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflClosedBranchWarningTitle'),
      textLocalized: ApplicationDialog.t('wflClosedBranchWarningText'),
      actions: {
        falseLocalized: ApplicationDialog.t('miskOk')
      }
    })
  }
}

export class WflVestingInfo extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflVestingInfoTitle'),
      textLocalized: ApplicationDialog.t('wflVestingInfoText'),
      actions: {
        falseLocalized: ApplicationDialog.t('miskOk')
      }
    })
  }
}
