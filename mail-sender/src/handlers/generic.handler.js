import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SERVER_ERROR } from '../constants/http-status.constants.js';
import { logger } from '../utils/logger.utils.js';
import { getEmailTemplateByType } from '../client/email-template.client.js';
import { EmailServiceFactory } from '../services/email/email.service.factory.js';
import { SimpleEmailParser } from '../services/email/parsers/simple-email.parser.js';
import { MJMLEmailParser } from '../services/email/parsers/mjml-email.parser.js';

class GenericHandler {
  constructor() {
    this.emailService = null;
  }

  async initializeEmailService() {
    if (!this.emailService) {
      // Initialize email service based on environment and configuration
      const isDevelopment = process.env.NODE_ENV === 'development';
      const emailProvider = isDevelopment ? 'dev-smtp' : (process.env.EMAIL_PROVIDER || 'sendgrid');
      
      logger.info(`Initializing email service with provider: ${emailProvider}`);
      this.emailService = await EmailServiceFactory.createService(emailProvider);
    }
    return this.emailService;
  }

  async sendMail(
    senderEmailAddress,
    recipientEmailAddress,
    templateType,
    templateData
  ) {
    try {
      // Ensure email service is initialized
      const emailService = await this.initializeEmailService();

      // Fetch the email template from commerceTools Custom Objects
      const emailTemplate = await getEmailTemplateByType(templateType);
      const parsedBody = MJMLEmailParser.parse(emailTemplate.body, templateData);
      // Parse the subject line with simple variable substitution
      const parsedSubject = SimpleEmailParser.parse(emailTemplate.subject, templateData);
      

      

      // Send email using the email service
      await emailService.sendEmail({
        from: senderEmailAddress,
        to: recipientEmailAddress,
        subject: parsedSubject,
        body: parsedBody,
      });
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async process() {
    throw new CustomError(
      'NotImplementedError',
      'Process method must be implemented by child class',
      HTTP_STATUS_SERVER_ERROR
    );
  }
}

export default GenericHandler;
