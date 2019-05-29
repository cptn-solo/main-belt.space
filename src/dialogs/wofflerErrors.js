import ApplicationError from './applicationError'

export class WflBranchesLoadError extends ApplicationError {
  constructor(error) {
    super(error, 'Load branches error', 'Error loading branches data')
  }
}