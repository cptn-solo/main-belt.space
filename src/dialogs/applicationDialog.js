import store from 'src/state/store'

export default class ApplicationDialog {
  constructor(confirmable = null) {
    if (confirmable) {
      this.title =
        confirmable.titleLocalized ||
        (confirmable.title
          ? ApplicationDialog.t(confirmable.title)
          : this.title)
      this.text =
        confirmable.textLocalized ||
        (confirmable.text ? ApplicationDialog.t(confirmable.text) : this.text)
    } else {
      this.title = ApplicationDialog.t('adCTitleDefault')
      this.text = ApplicationDialog.t('adCTextDefault')
    }

    if (confirmable && confirmable.actions) {
      const actions = {}

      if (confirmable.actions.falseLocalized)
        actions['false'] = confirmable.actions.falseLocalized
      else if (confirmable.actions.false)
        actions['false'] = ApplicationDialog.t(confirmable.actions.false)

      if (confirmable.actions.trueLocalized)
        actions['true'] = confirmable.actions.trueLocalized
      else if (confirmable.actions.true)
        actions['true'] = ApplicationDialog.t(confirmable.actions.true)

      this.actions = actions
    } else {
      this.actions = {
        false: ApplicationDialog.t('adCCancelDefault'),
        true: ApplicationDialog.t('adCProceedDefault'),
      }
    }
  }

  static t(message, args) {
    return store.state.engine.i18n.t(message, args)
  }
}
