/**
 * Server Error, StatusCode: 500
 */
import HttpException from './http.exception';

class ServerErrorException extends HttpException {
  constructor(message?: string) {
    if (!message) {
      super(`Server Error`, 500);
    } else {
      super(message, 500);
    }
  }
}

export default ServerErrorException;
