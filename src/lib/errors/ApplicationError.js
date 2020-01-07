class ApplicationError extends Error {
  constructor(message, status, detail) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || 'Something went wrong. Please try again.';

    this.status = status || 500;

    if (detail) {
      this.detail = detail;
    }
  }

  static format(err) {
    const formatted = {
      error: {
        name: err.name,
        message: err.message,
      },
    };

    if (err.detail) {
      formatted.detail = err.detail;
    }

    return formatted;
  }
}

export default ApplicationError;
