import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import jwtConfig from '@config/jwt';
import User, { IUser } from '@models/user.schema';
import HttpException from '@exceptions/http.exception';

interface IDecoded {
  id?: string;
  role?: string;
}

export interface IRequest extends Request {
  user?: IUser;
}

// 中间件：校验token
export const protect = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new HttpException('Not authorize to access this route', 401));
  }

  try {
    // Verify token
    const decoded: IDecoded = verify(
      token,
      jwtConfig.jwtSecret as string
    ) as object;

    req.user = (await User.findById(decoded.id)) as IUser;

    next();
  } catch (err) {
    return next(new HttpException('Not authorize to access this route', 401));
  }
};

/**
 * 角色校验
 */
export const authorize = (...roles: any) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new HttpException(
          `User role ${req.user?.role} is not authorized to access this route`,
          401
        )
      );
    }
    next();
  };
};
