import { createConnection, Connection } from 'typeorm';
import logger from './logger';

const connection = async (): Promise<Connection | null> => {
  try {
    logger.info('Begin Databse Connection');
    const db = await createConnection();
    logger.info('Connect To Database Sucessfully');
    return db;
  } catch (error) {
    logger.error(`🔥 Cannot connect to Database message: ${error.message} 🔥`);
  }
};

export default connection;
