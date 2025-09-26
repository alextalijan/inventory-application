class CustomError extends Error {
  constructor(message, statusCode, route = null) {
    super(message);
    this.statusCode = statusCode;
    if (route) {
      this.route = route;
    }
  }
}

module.exports = CustomError;
