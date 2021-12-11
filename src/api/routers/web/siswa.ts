import { Router } from 'express';
import { Container } from 'typedi';

import catchAsync from '@utils/catchAsync';
import SiswaController from '@controllers/SiswaController';
import isAuth from '@middlewares/isAuth';

const router = Router();

export default (app: Router) => {
  app.use('/siswa', router);

  const siswa = Container.get(SiswaController);

  router.get('/findbynameorid', catchAsync(siswa.getByNameOrId));
  router.patch('/delete/:id', catchAsync(isAuth), catchAsync(siswa.delete));
  router
    .route('/')
    .get(catchAsync(siswa.getAll))
    .post(catchAsync(isAuth), catchAsync(siswa.create));

  router.route('/:id').patch(catchAsync(isAuth), catchAsync(siswa.update));
};
