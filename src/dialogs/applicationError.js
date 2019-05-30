export default class ApplicationError extends Error {
  constructor(error, title = 'Application Error', text = null) {
    super()
    this.error = error
    this.title = error.title || title
    this.text = error.text || error.message || text || error
  }
}
