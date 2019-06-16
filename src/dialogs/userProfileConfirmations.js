import ApplicationDialog from './applicationDialog'

export class UserProfileDepositConfirm extends ApplicationDialog {
  constructor(params = []) {
    super({ titleLocalized: ApplicationDialog.t('udCDepositTitle') })
    this.params = params
  }
  setAsset(asset) {
    this.params.push(asset)
    this.text = ApplicationDialog.t('udCDepositText', this.params)
  }
}

export class UserProfileWithdrawConfirm extends ApplicationDialog {
  constructor(params = []) {
    super({ titleLocalized: ApplicationDialog.t('udCWithdrawTitle') })
    this.params = params
  }
  setAsset(asset) {
    this.params.push(asset)
    this.text = ApplicationDialog.t('udCWithdrawText', this.params)
  }
}

export class UserProfileForgetKeyConfirm extends ApplicationDialog {
  constructor() {
    super({
      title: 'udCFogretKeyTitle',
      text: 'udCFogretKeyText',
    })
  }
}

export class UserProfileDecryptKeyConfirm extends ApplicationDialog {
  constructor() {
    super({
      title: 'udCImportKeyTitle',
      text: 'udCImportKeyFailureText',
      actions: {
        true: 'udCImportKeyFailureDecrypt',
      },
    })
  }
}

export class RegisterWithImportedKeyConfirm extends ApplicationDialog {
  constructor() {
    super({
      title: 'udCRegisterImportedKeyTitle',
      text: 'udCRegisterImportedKeyText',
      actions: {
        true: 'udCRegisterImportedKeyRegister',
      },
    })
  }
}

export class SubmitResourceChangeConfirm extends ApplicationDialog {
  constructor() {
    super({
      title: 'udCSubmitResChangeConfirmTitle',
      text: 'udCSubmitResChangeConfirmText',
    })
  }
}

export class BackupKeyPromptConfirm extends ApplicationDialog {
  constructor() {
    super({
      title: 'udCBackupKeyTitle',
      text: 'udCBackupKeyText',
      actions: {
        false: 'udCBackupKeyLater',
        true: 'udCBackupKeyBackup',
      },
    })
  }
}

export class RegistredAccountKeyBackupPromptConfirm extends ApplicationDialog {
  constructor(registredAccount, registredNickname) {
    super({
      title: 'udCRegistredAccountAndNicknameTitle',
      textLocalized: ApplicationDialog.t('udCRegistredAccountAndNicknameText', [
        registredAccount,
        registredNickname,
      ]),
      actions: {
        false: 'udCBackupKeyLater',
        true: 'udCBackupKeyBackup',
      },
    })
  }
}
