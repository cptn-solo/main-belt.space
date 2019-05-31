import ApplicationError from './applicationError'

export class WflBranchesLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load branches error', 'Error loading branches data')
  }
}

export class WflBranchMetasLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load branch metadata error', 'Error loading branch metadata')
  }
}

export class WflLevelsLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load levels error', 'Error loading levels')
  }
}
