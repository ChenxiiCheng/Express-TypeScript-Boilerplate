/**
 * Bad request, StatusCode: 400
 */
import HttpException from './http.exception';

class BadRequestException extends HttpException {
  constructor(message?: string) {
    if (!message) {
      super(`Bad request`, 400);
    } else {
      super(message, 400);
    }
  }
}

export default BadRequestException;
