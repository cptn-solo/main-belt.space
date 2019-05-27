import ApplicationDialog from './applicationDialog'

export class UserProfileTransferConfirm extends ApplicationDialog {
  constructor(assetSymbol, value, account) {
    super({
      titleLocalized:
        ApplicationDialog.t('udCTransferTitle') + ': ' + assetSymbol,
      textLocalized: ApplicationDialog.t('udCTransferText', [value, account]),
    })
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
