import ApplicationDialog from './applicationDialog'

export class BranchSwitchConfirm extends ApplicationDialog {
  constructor() {
    super({
      titleLocalized: ApplicationDialog.t('wflJoinGameConfirmTitle'),
      textLocalized: ApplicationDialog.t('wflJoinGameConfirmText'),
    })
  }
}