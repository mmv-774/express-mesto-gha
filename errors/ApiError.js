class ApiError extends Error {
  constructor(statusCode, name, message) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  static badRequest(message) {
    return new ApiError(400, 'BadRequestError', message);
  }

  static notFound(message) {
    return new ApiError(404, 'NotFoundError', message);
  }

  static internal(message = 'Что-то пошло нет так') {
    return new ApiError(500, 'InternalError', message);
  }
}

module.exports = ApiError;
