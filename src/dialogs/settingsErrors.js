import ApplicationError from './applicationError'

export class SettingsReloadLocaleMessagesError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Load locale messages error',
      'Error while loading locale messages'
    )
  }
}
