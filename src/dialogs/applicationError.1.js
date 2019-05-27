export default class ApplicationError extends Error {
  constructor(error, title = 'Application Error', text = null) {
    const message = text || (error ? error.message : null) || error
    super(message)

    this.error = error
    this.title = title
    this.text = text
      ? text + (error && error.title ? ': ' + error.title : '')
      : message
  }
}
