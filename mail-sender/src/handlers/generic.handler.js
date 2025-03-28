import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SERVER_ERROR } from '../constants/http-status.constants.js';
import { logger } from '../utils/logger.utils.js';
import { getEmailTemplateByType } from '../client/email-template.client.js';
import { EmailServiceFactory } from '../services/email/email.service.factory.js';
import { EditorJSEmailParser } from '../services/email/parsers/editorjs-email.parser.js';
import { SimpleEmailParser } from '../services/email/parsers/simple-email.parser.js';

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
    logger.info(`senderEmailAddress: ${senderEmailAddress}`);
    logger.info(`recipientEmailAddress: ${recipientEmailAddress}`);
    logger.info(`templateType: ${templateType}`);
    logger.info(`templateData: ${JSON.stringify(templateData, null, 2)}`);

    try {
      // Ensure email service is initialized
      const emailService = await this.initializeEmailService();

      // Fetch the email template from commerceTools Custom Objects
      const emailTemplate = await getEmailTemplateByType(templateType);
      
      // Parse the EditorJS template to HTML and replace variables
      const parsedBody = EditorJSEmailParser.parse(emailTemplate.body, templateData);
      
      // Parse the subject line with simple variable substitution
      const parsedSubject = SimpleEmailParser.parse(emailTemplate.subject, templateData);
      
      // For now, we'll just log the template
      logger.info('Email template:', emailTemplate);
      
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
