import { Router } from 'express';
import { Container } from 'typedi';

import catchAsync from '@utils/catchAsync';
import AuthController from '@controllers/AuthController';
import isAuth from '@middlewares/isAuth';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);

  const auth = Container.get(AuthController);
  router.post('/request-token', catchAsync(auth.login));
  router.post('/register', catchAsync(auth.register));

  router.post(
    '/change-password',
    catchAsync(isAuth),
    catchAsync(auth.changePassword),
  );
};
