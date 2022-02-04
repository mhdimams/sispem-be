import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';

import { ILoginBody, IUserBody } from '@interfaces';
import config from '@app/config';
import { ServerError } from '@app/utils/AppError';

@Service()
export default class PembayaranServices {
  @Inject('UserModel')
  private userRepo: Models.User;
  private salt: number = 10;

  public async getTokenLogin({ username, password }: ILoginBody) {
    const user = await this.userRepo.findOne({ username: username });
    try {
      if (!user) {
        throw new ServerError('No user found');
      }

      const checkPassword = await this.comparePassword(password, user.password);
      if (!checkPassword) {
        throw new ServerError('Username or password is incorrect');
      }

      return await this.generateToken(user.id);
    } catch (error) {
      throw error;
    }
  }

  public async findUserById(id: number) {
    const user = await this.userRepo.findOne({ id: id });
    return user;
  }

  public async createUser(body: IUserBody) {
    try {
      const password = await this.generateHash(body.password);
      const result = await this.userRepo.insert({
        ...body,
        password: password,
      });

      if (result.raw.affectedRows < 1)
        throw new ServerError(
          'Gagal melakukan registrasi, data tidak tersimpan',
        );

      const token = await this.generateToken(result.identifiers[0].id);
      return token;
    } catch (error) {
      throw error;
    }
  }

  private async generateHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, this.salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        return resolve(hash);
      });
    });
  }

  public async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user = await this.findUserById(id);

      if (!user) return false;

      const checkPassword = await this.comparePassword(
        oldPassword,
        user.password,
      );
      if (!checkPassword) return false;

      const hashedPassword = await this.generateHash(newPassword);

      await this.userRepo.update(id, { password: hashedPassword });
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async comparePassword(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(passwordString, passwordHash);
    } catch (error) {
      throw error;
    }
  }

  private async generateToken(user_id: number) {
    const token = jwt.sign({ user_id }, config.jwt.secret, {
      expiresIn: config.jwt.expires,
    });

    return {
      token,
      expiresIn:
        Date.now() + parseInt(config.jwt.expires.split('')[0]) * 60 * 60 * 1000,
    };
  }

  public verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (secret) {
        jwt.verify(token, secret, function (err, decoded) {
          if (err) {
            return reject(err);
          }

          if (typeof decoded === 'object') {
            return resolve(decoded as any);
          }
        });
      }
    });
  }
}
