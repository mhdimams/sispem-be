import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserServices from '@services/userServices';
import { BadRequest, HTTPUnauthorized } from '@utils/AppError';
import config from '@app/config';

export default async (req: Request, res: Response, next: NextFunction) => {
  let token: string;
  const userServices = Container.get(UserServices);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.cookie) {
    const cookies = getAppCookies(req) as any;
    token = cookies[config.tokenName];
  }

  if (!token) {
    throw new HTTPUnauthorized('You are not allow to access this endpoint');
  }

  const decode = await userServices.verifyToken(token, config.jwt.secret);

  // get client
  const client = await userServices.findUserById(decode.user_id);
  if (!client) {
    throw new BadRequest(`No user found with that userid`);
  }

  Reflect.deleteProperty(client, 'password');

  req.currentUser = client;
  next();
};

const getAppCookies = (req: Request) => {
  const rawCookies = req.headers.cookie.split('; ');

  const parsedCookies = {};
  rawCookies.forEach(rawCookie => {
    const parsedCookie = rawCookie.split('=');

    parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });
  return parsedCookies;
};
