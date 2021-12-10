import { Router } from 'express';
import { Container } from 'typedi';

import catchAsync from '@utils/catchAsync';
import PembayaranController from '@controllers/PembayaranController';
import isAuth from '@middlewares/isAuth';

const router = Router();

export default (app: Router) => {
  app.use('/pembayaran', router);

  const pembayaran = Container.get(PembayaranController);

  router.post('/invoice', catchAsync(pembayaran.generateDownloadPDF));
  router.post(
    '/transaksibayar',
    catchAsync(isAuth),
    catchAsync(pembayaran.transaksiPembayaran),
  );
  router.get(
    '/siswapertahun',
    catchAsync(pembayaran.getPembayaranSiswaPertahun),
  );

  router.post(
    '/laporan-pembayaran',
    catchAsync(isAuth),
    catchAsync(pembayaran.getRangePembayaran),
  );

  router.route('/:id').get(catchAsync(pembayaran.getPembayaranById));
};
