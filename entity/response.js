class Response {
  constructor(status, data = [], errors = []) {
    this.status = status
    this.data = data
    this.errors = errors
  }
}

module.exports = Response