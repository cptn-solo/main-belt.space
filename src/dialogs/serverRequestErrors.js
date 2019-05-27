import ApplicationError from './applicationError'
export class ServerRequestError extends ApplicationError {
  constructor(error) {
    super(error, 'Server request failure')
  }
}
