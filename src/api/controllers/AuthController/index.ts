import { Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import moment from 'moment';

import Controller from '@controllers/Controller';
import autobind from '@utils/autobind';
import UserServices from '@services/userServices';
import { BadRequest, ServerError } from '@utils/AppError';
import config from '@app/config';

@Service()
export default class AuthController extends Controller {
  constructor(@Inject() private userServices: UserServices) {
    super();
  }

  @autobind
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userServices.createUser({ ...req.body });

    this.response(res, 200, result);
  }

  @autobind
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { username, password } = req.body;

    if (!username || !password)
      throw new BadRequest('username and password are required');

    const token = await this.userServices.getTokenLogin({
      username,
      password,
    });

    const cookieOptions = {
      expires: moment().add(1, 'hour').utcOffset('+0700').toDate(),
      httpOnly: false,
      secure: false,
    };

    if (config.nodeEnv === 'production') cookieOptions.secure = true;

    res.cookie(config.tokenName, token.token, {
      sameSite: config.nodeEnv === 'production' ? 'none' : undefined,
      ...cookieOptions,
    });

    this.response(res, 200, token);
  }

  @autobind
  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { oldPassword, newPassword, newPasswordConfirmation } = req.body;

    if (!newPassword || !newPasswordConfirmation || !oldPassword) {
      throw new BadRequest(`New & Old password is required!`);
    }

    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequest(`New Password missmatch`);
    }

    const result = await this.userServices.changePassword(
      req.currentUser.id,
      oldPassword,
      newPassword,
    );

    if (!result) {
      throw new ServerError(`Failed update password`);
    }

    this.response(res, 200, result);
  }
}
