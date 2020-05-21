/**
 * Invalid credential, StatusCode: 401
 */
import HttpException from './http.exception';

class InvalidCredentialException extends HttpException {
  constructor(message?: string) {
    if (!message) {
      super(`Invalid credentials`, 401);
    } else {
      super(message, 401);
    }
  }
}

export default InvalidCredentialException;
