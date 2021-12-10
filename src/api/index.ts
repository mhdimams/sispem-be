import { Router } from 'express';

import auth from '@routes/web/auth';
import siswa from '@routes/web/siswa';
import pembayaran from '@routes/web/pembayaran';

export default () => {
  const app = Router();

  /**
   * Web Router
   */

  auth(app);
  siswa(app);
  pembayaran(app);

  return app;
};
