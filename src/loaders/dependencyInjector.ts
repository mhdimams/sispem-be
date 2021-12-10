import { Container } from 'typedi';
import LoggerInstance from './logger';

interface Repositories {
  name: string;
  repository: any;
}
export default ({
  repositories,
  connection,
}: {
  repositories?: Repositories[];
  connection?: any;
}) => {
  try {
    Container.set('Logger', LoggerInstance);
    if (connection) {
      Container.set('connection', connection);
    }

    if (repositories.length) {
      repositories.forEach(repo => {
        Container.set(repo.name, repo.repository);
      });
    }

    LoggerInstance.info('Repositories injected into container');
  } catch (error) {
    LoggerInstance.error('🔥 Error on dependency injector loader', error);
    throw error;
  }
};
