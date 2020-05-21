/**
 * Not found, StatusCode: 404
 */
import HttpException from './http.exception';

class NotFoundException extends HttpException {
  constructor(id?: string) {
    if (id) {
      super(`Resource Not found with id of ${id}`, 404);
    } else {
      super(`Resource not found`, 404);
    }
  }
}

export default NotFoundException;
