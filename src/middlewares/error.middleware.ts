import { Request, Response, NextFunction } from 'express';
import HttpException from 'exceptions/http.exception';

/**
 * 开发者能确定的具体错误直接用封装好的exceptions即可
 * 若未知的错误，直接next(error) 交给globalErrorMiddleware处理
 * @param err
 * @param req
 * @param res
 * @param next
 */
interface IErr {
  code?: number;
  name?: string;
  errmsg?: string; // Error里自带的errmsg
  message: string; // 封装的http-expcetions里的message
  statusCode: number;
}
const globalErrorMiddleware = (
  err: IErr,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log to console for dev
  console.log(err);

  // 未知错误1: MongoDB duplicate key (err.code === 11000, err.name === 'MongoError')
  if (err.code === 11000 && err.name === 'MongoError') {
    const newMsg = err.errmsg; // Class Error的错误消息字段
    err = new HttpException(newMsg as string, 400);
  }

  // 未知错误2：Mongoose校验字段错误 (err.name === 'ValidatorError')
  // if (err.name == 'ValidatorError') {
  //   const newMsg = Object.values(err.errors as Object).map(
  //     (val) => val.message
  //   );
  //   err = new HttpException((newMsg as unknown) as string, 400);
  // }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });

  next();
};

export default globalErrorMiddleware;
