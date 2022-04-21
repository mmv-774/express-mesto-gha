class HttpError extends Error {
  constructor(statusCode, name, message) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  static badRequest(message) {
    return new HttpError(400, 'BadRequestError', message);
  }

  static unauthorized(message) {
    return new HttpError(401, 'UnauthorizedError', message);
  }

  static forbidden(message) {
    return new HttpError(403, 'ForbiddenError', message);
  }

  static notFound(message) {
    return new HttpError(404, 'NotFoundError', message);
  }

  static conflict(message) {
    return new HttpError(409, 'ConflictError', message);
  }

  static internal(message = 'Что-то пошло нет так') {
    return new HttpError(500, 'InternalError', message);
  }
}

module.exports = HttpError;
