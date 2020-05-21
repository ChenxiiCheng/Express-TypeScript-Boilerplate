// 返回错误类型的基类，其他类型比如NotFoundException继承这个
class HttpException extends Error {
  message: string;
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default HttpException;
