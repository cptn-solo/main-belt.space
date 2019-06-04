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

export class WflChildLevelsLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load child levels error', 'Error loading child levels')
  }
}

export class WflParentLevelLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load parent level error', 'Error loading parent level')
  }
}

export class WflBranchSwitchError extends ApplicationError {
  constructor(error) {
    super(error, 'Join game', 'Error joining the game')
  }
}

export class WflPlayerActionError extends ApplicationError {
  constructor(error) {
    super(error, 'Action error', 'Error while calling an action')
  }
}
