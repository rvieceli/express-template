import ApplicationError from './ApplicationError';

class InvalidCredentialsError extends ApplicationError {
  constructor(message = 'User or password is invalid') {
    super(message, 400);
  }
}

export default InvalidCredentialsError;
