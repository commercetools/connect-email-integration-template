import sgMail from '@sendgrid/mail';
import { EmailServiceInterface } from '../email.service.interface.js';
import { logger } from '../../../utils/logger.utils.js';

export default class SendGridProvider extends EmailServiceInterface {
  constructor() {
    super();
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is not set');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail({ from, to, subject, body, options = {} }) {
    try {
      const msg = {
        to,
        from,
        subject,
        html: body,
        ...options,
      };

      await sgMail.send(msg);
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error('Error sending email with SendGrid:', error);
      throw new Error('Failed to send email');
    }
  }
} 