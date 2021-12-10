import expressLoader from './express';
import Logger from './logger';
import mongoose from './database';
import repositories from './repositories';
import dependenciesInjection from './dependencyInjector';

export default async ({ expressApp }) => {
  const connection = await mongoose();
  Logger.info('Database Loaded');

  dependenciesInjection({
    repositories: require('./repositories').default,
    connection: connection,
  });
  Logger.info('Dependencies Injected');

  await expressLoader({ app: expressApp });
  Logger.info('Express Loaded');
};
