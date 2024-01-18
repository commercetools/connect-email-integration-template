import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import SendGridMail from '@sendgrid/mail';
import CustomError from '../errors/custom.error.js';
class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail(email) {
    SendGridMail.setApiKey(process.env.EMAIL_PROVIDER_API_KEY);
    const msg = {
      to: email,
      from: 'kinghing.leung@commercetools.com', // Provided by user
      templateId: 'd-dea1ed619a874fd88501535f6ebfee61', // Provided by user
    };
    try {
      await SendGridMail.send(msg);
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
