import { Response, NextFunction } from 'express';

export default class Controller {
  constructor() {}

  protected response<T>(
    res: Response,
    statusCode: number,
    data: T,
    message: string = 'success',
  ) {
    return res.status(statusCode).json({
      message,
      data,
    });
  }
}
