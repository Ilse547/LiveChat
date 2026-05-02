class ResponseError extends Error {
  constructor(message, status = 500, code = 'Error') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = { ResponseError };