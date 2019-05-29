import ApplicationError from './applicationError'

export class ScatterConnectError extends ApplicationError {
  constructor(error) {
    super(error, 'Scatter connection error', 'Error connecting Scatter')
  }
}

export class ScatterSuggestNetworkError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Add blockchain to Scatter',
      'Error adding blockchain to Scatter'
    )
  }
}

export class ScatterGetPublicKeyError extends ApplicationError {
  constructor(error) {
    super(error, 'Public key request', 'Error getting public key from Scatter')
  }
}

export class ScatterLinkAccountError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Link new account to public key',
      'Error while trying assign new account to public key'
    )
  }
}

export class ScatterLoginError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Login with Scatter error',
      'Error while trying login with Scatter'
    )
  }
}

export class ScatterNotConnectedError extends ApplicationError {
  constructor() {
    super(
      'Please check if Scatter running and unlocked',
      'Scatter not connected'
    )
    this.connectionIssue = true
  }
}

export class ScatterRequestTransferError extends ApplicationError {
  constructor(error) {
    super(
      error,
      'Create transfer with Scatter error',
      'Error while requesting transfer from Scatter'
    )
  }
}
