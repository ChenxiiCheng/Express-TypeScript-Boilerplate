import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '@models/user.schema';
import jwtConfig from '@config/jwt';
import config from '@config/config';
import { IRequest } from '@middlewares/auth.middleware';
import BadRequestException from '@exceptions/bad-request.exception';
import InvalidCredentialException from '@exceptions/invalid-credential.exception';
import NotFoundException from '@exceptions/not-found.exception';

class AuthController {
  /**
   * @desc   Register user
   * @route  POST /api/v1/auth/register
   * @access Public
   * @param  req
   * @param  res
   */
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role,
      });

      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @desc   Login user
   * @route  POST /api/v1/auth/login
   * @access Public
   * @param  req
   * @param  res
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Validate email & password
      if (!email || !password) {
        return next(
          new BadRequestException('Please provide an email and password')
        );
      }

      // Check for user
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return next(new InvalidCredentialException());
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return next(new InvalidCredentialException());
      }

      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get token from model, create cookie and send response
   */
  private sendTokenResponse = (
    user: IUser,
    statusCode: number,
    res: Response
  ) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
      // 30days
      expires: new Date(
        Date.now() +
          parseInt(jwtConfig.jwtCookieExpire as string) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: false,
    };

    if (config.nodeEnv === 'production') {
      options.secure = true;
    }

    return res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  };

  /**
   * @desc   Get current logged in user
   * @route  POST /api/v1/auth/me
   * @access Private
   * @param  req
   * @param  res
   */
  public getMe = async (req: IRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @desc   Forgot password
   * @route  POST /api/v1/auth/forgotpassword
   * @access Private
   * @param  req
   * @param  res
   */
  public forgotPassword = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new NotFoundException('There is no user with that email'));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    console.log(resetToken);

    res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @desc   Reset password
   * @route  PUT /api/v1/auth/resetpassword/:resettoken
   * @access Public
   * @param  req
   * @param  res
   */
  public resetPassword = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now().toString() },
    });

    if (!user) {
      return next(new BadRequestException('Invalid token'));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    this.sendTokenResponse(user, 200, res);
  };

  /**
   * @desc   Update user details
   * @route  PUT /api/v1/auth/updatedetails
   * @access Private
   * @param  req
   * @param  res
   */
  public updateDetails = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user?.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @desc   Update password
   * @route  PUT /api/v1/auth/updatepassword
   * @access Private
   * @param  req
   * @param  res
   */
  public updatePassword = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findById(req.user?.id).select('+password');

    // Check current password
    if (!(await user?.matchPassword(req.body.currentPassword))) {
      return next(new InvalidCredentialException('Password is incorrect'));
    }

    (user as IUser).password = req.body.newPassword;
    await user?.save();

    this.sendTokenResponse(user as IUser, 200, res);
  };
}

export default new AuthController();
