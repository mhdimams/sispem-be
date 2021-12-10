import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import config from '@app/config';
import { ServerError } from '@utils/AppError';

type Provider = 'google' | 'nodemailer';

export default class Email {
  private user: any;

  public async newTransport() {
    const { google: gmail, mailtrap } = config.mail;

    if (config.nodeEnv === 'production') {
      const oauth2Client = new google.auth.OAuth2(
        gmail.clientId,
        gmail.clientSecret,
        gmail.redirectUrl,
      );

      oauth2Client.setCredentials({
        refresh_token: gmail.refreshToken,
      });

      const accessToken: string = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject(
              new ServerError('Failed to get gmail Auth access token', err),
            );
          }

          resolve(token);
        });
      });

      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: gmail.user,
          accessToken,
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
        },
      });
    }

    return nodemailer.createTransport({
      host: mailtrap.host,
      port: mailtrap.port,
      auth: {
        user: mailtrap.username,
        pass: mailtrap.password,
      },
    } as any);
  }
}
