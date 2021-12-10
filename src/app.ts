import 'reflect-metadata';
import express from 'express';

import config from '@app/config';
import loader from '@app/loaders';
import Logger from '@app/loaders/logger';

const startServer = async () => {
  const app = express();

  const listenOn = '0.0.0.0';

  await loader({ expressApp: app });
  app
    .listen(config.port, listenOn, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
      `);
    })
    .on('error', err => {
      process.exit(1);
    });
};

startServer();
