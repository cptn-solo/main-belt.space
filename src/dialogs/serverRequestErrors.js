import ApplicationError from './applicationError'
export class ServerRequestError extends ApplicationError {
  constructor(error) {
    super(error.message || error, 'Server request failure')    
    if (error.message && error.message === 'Network Error')
      this.networkError = true
  }
}
