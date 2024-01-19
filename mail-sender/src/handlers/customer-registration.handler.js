import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import SendGridMail from '@sendgrid/mail';
import CustomError from '../errors/custom.error.js';
import { logger } from '../utils/logger.utils.js';

class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail(email) {
    try {
      SendGridMail.setApiKey(process.env.EMAIL_PROVIDER_API_KEY);
      const msg = {
        to: email,
        from: process.env.SENDER_EMAIL_ADDRESS, // Provided by user
        templateId: process.env.CUSTOMER_REGISTRATION_TEMPLATE_ID, // Provided by user
      };

      await SendGridMail.send(msg);
      logger.info(
        `Confirmation email of customer registration has been sent to ${email}.`
      );
    } catch (err) {
      const statusCode = err?.code;
      const errors = JSON.stringify(err.response?.body?.errors);

      throw new CustomError(
        statusCode,
        'Fail to communicate with SendGrid.',
        errors
      );
    }
  }

  async process(messageBody) {
    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);
    await this.sendMail(customer.email);
  }
}
export default CustomerRegistrationHandler;
