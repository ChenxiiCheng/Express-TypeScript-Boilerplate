import { Request, Response, NextFunction } from 'express';
import User from '@models/user.schema';

class AdminUserController {
  /**
   * @desc   Get all users
   * @route  GET /api/v1/auth/users
   * @access Private
   * @param  req
   * @param  res
   */
  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json();
  };

  /**
   * @desc   Get single user
   * @route  GET /api/v1/auth/users/:id
   * @access Private/Admin
   * @param  req
   * @param  res
   */
  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @desc   Create user
   * @route  POST /api/v1/auth/users
   * @access Private/Admin
   * @param  req
   * @param  res
   */
  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.create(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @desc   Update user
   * @route  PUT /api/v1/auth/users/:id
   * @access Private/Admin
   * @param  req
   * @param  res
   */
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @desc   Delete user
   * @route  DELETE /api/v1/auth/users/:id
   * @access Private/Admin
   * @param  req
   * @param  res
   */
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: {},
    });
  };
}

export default new AdminUserController();
