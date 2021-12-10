import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.APP_PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',

  api: {
    web: {
      v1: '/apiweb/v1',
    },
  },

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  tokenName: 'PEMTOKEN',

  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRED_IN,
    cookieExpires: process.env.JWT_COOKIE_EXPIRED_IN,
  },

  databaseUrl: process.env.DATABASE_URL!,
  databaseUser: process.env.DATABASE_USERNAME || 'username',
  databasePass: process.env.DATABASE_PASSWORD || 'password',
  databaseHost: process.env.DATABASE_HOST || 'localhost',

  whitelist: process.env.WHITELIST
    ? process.env.WHITELIST.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'],

  mail: {
    google: {
      user: process.env.GMAIL_ACCOUNT,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      redirectUrl: process.env.GMAIL_REDIRECT_URL,
    },
    mailtrap: {
      username: process.env.MAILTRAP_USERNAME,
      password: process.env.MAILTRAP_PASSWORD,
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
    },
  },
};
