import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import config from '@app/config';
import { AppError, BadRequest, HTTPNotFound } from '@app/utils/AppError';
import Logger from './logger';
import router from '@app/api';

export default ({ app }: { app: express.Application }) => {
  const { whitelist } = config;

  app.get('/', (req, res) => {
    res.status(200).send(`API MauCPNS ${config.nodeEnv}`);
  });

  app.enable('trust proxy');

  /**
   * Cors
   */
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        if (whitelist.indexOf(origin) === -1 && whitelist.indexOf('*') === -1) {
          const msg = `The CORS policy for this site does not allow access from this ${origin} specified Origin`;
          return callback(new BadRequest(msg), false);
        }

        return callback(null, true);
      },
      credentials: true,
    }),
  );

  /**
   * API Rate Limit
   */
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'To many request from this IP, Please try again in an hour',
  });

  app.use(config.api.web.v1, limiter);

  /**
   * Check Status
   */
  app.get('/status', (req, res) => {
    res.status(200).send({ message: 'OK' });
  });

  /**
   * Body Parser
   */
  app.use(express.json({ limit: '1mb' }));

  /**
   * Load Route
   */
  app.use(config.api.web.v1, router());

  /**
   * HTTP NOT Found Handler
   */
  app.use((req: Request, res: Response, next: NextFunction) => {
    throw new HTTPNotFound(`Page you are looking ${req.originalUrl} not found`);
  });

  /**
   * Global Error Catcher
   */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const obj = {
      instance: err instanceof AppError ? 1 : 0,
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    };
    Logger.error(JSON.stringify(obj));

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
        errors: err.error,
      });
    }

    let statusCode: number;

    if (err.message === 'jwt expired') {
      statusCode = 401;
    }

    return res.status(statusCode || 500).json({
      status: 'error',
      statusCode: statusCode,
      message: err.message,
      errors: err,
    });
  });
};
