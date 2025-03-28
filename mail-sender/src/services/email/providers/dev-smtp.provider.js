import nodemailer from 'nodemailer';
import { EmailServiceInterface } from '../email.service.interface.js';
import { logger } from '../../../utils/logger.utils.js';

class DevSMTPProvider extends EmailServiceInterface {
  constructor() {
    super();
    // Create a transporter using smtp4dev configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.DEV_SMTP_HOST || 'localhost',
      port: process.env.DEV_SMTP_PORT || 25,
      secure: false, // true for 465, false for other ports like 25
      tls: {
        rejectUnauthorized: false // Required for self-signed certificates
      }
    });

    // Verify SMTP connection
    this.transporter.verify((error) => {
      if (error) {
        logger.error('Error connecting to development SMTP server:', error);
        throw new Error('Failed to connect to development SMTP server');
      }
      logger.info('Successfully connected to development SMTP server');
    });
  }

  async sendEmail({ from, to, subject, body, options = {} }) {
    try {
      const mailOptions = {
        from,
        to,
        subject,
        html: body,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Development email sent successfully to ${to}`);
      logger.info('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      logger.error('Error sending development email:', error);
      throw new Error('Failed to send development email');
    }
  }
}

export default DevSMTPProvider; 