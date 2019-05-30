import ApplicationError from './applicationError'

export class UserProfileLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load user profile error', 'Error loading user profile data')
  }
}

export class UserBalancesLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load user profile error', 'Error loading user balances data')
  }
}

export class UserTransferAssetError extends ApplicationError {
  constructor(error) {
    super(error, 'Transfer asset error', 'Error while transfer assets')
  }
}

export class UserProfileReCaptchaError extends ApplicationError {
  constructor(error) {
    super(error, 'Registration error', 'Error getting reCAPTCHA from user')
  }
}

export class UserProfileEmptyReCaptchaError extends ApplicationError {
  constructor() {
    super('reCAPTCHA token is empty', 'ReCAPTCHA error')
  }
}

export class UserProfileNotInitializedError extends ApplicationError {
  constructor() {
    super(
      'User in-game profile not found. Please enter Nick-name.',
      'User In-game profile'
    )
  }
}

export class UserProfileRegistrationError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Registration error',
      'Failed to register blockchain account for player'
    )
  }
}

export class UserProfileInitializationError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'User in-game profile initialization',
      "Error while initializing player's in-game profile"
    )
  }
}

export class UserProfileForgetError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Forget account',
      "Error while removing player's in-game profile"
    )
  }
}

export class UserProfileNoKeyToImportError extends ApplicationError {
  constructor() {
    super('No valid private key specified for import', 'Import key error')
  }
}

export class UserProfileNoKeyToExportError extends ApplicationError {
  constructor() {
    super('No private key for export', 'Export key error')
  }
}

export class UserProfileKeyExportError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Export key error',
      'Error while exporting private key from browser key storage'
    )
  }
}

export class UserProfileNoKeyToRegisterError extends ApplicationError {
  constructor() {
    super(
      'No valid private/public key pair specified for registration',
      'Registration error'
    )
  }
}

export class UserProfileNoKeyGeneratedError extends ApplicationError {
  constructor(error) {
    super(error, 'Generate key error', 'Error while generating new key pair')
  }
}

export class UserProfileImportKeyError extends ApplicationError {
  constructor(error) {
    super(
      error,
      error.title || 'Import key error',
      error.text || error || 'Error while importing private key'
    )
  }
}

export class UserProfileImportDecryptedKeyError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Decript and Import Key error',
      'Failed to decrypt and import private key'
    )
  }
}

export class UserProfileNoAccountError extends ApplicationError {
  constructor() {
    super('No account specified, please (re)authorize', 'Unknown account')
  }
}

export class UserProfileAccountsNotfoundError extends ApplicationError {
  constructor() {
    super(
      'No accounts registred in blockchain for key specified',
      'Accounts not found'
    )
  }
}

export class UserProfileAccountsLoadError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Load user accounts error',
      'Error loading user accounts from blockchain'
    )
  }
}

export class UserProfileFailureLoginError extends ApplicationError {
  constructor() {
    super('Cannot login with registred account', 'Login failure')
  }
}

export class UserProfileFailureProfileInitializationError extends ApplicationError {
  constructor() {
    super(
      'Cannot initialize in-game profile for registred account',
      'In-game profile failure'
    )
  }
}
