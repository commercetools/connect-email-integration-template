import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { send } from '../extensions/sendgrid.extension.js';

class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail(email) {
    const from = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.CUSTOMER_REGISTRATION_TEMPLATE_ID;

    await send(email, from, templateId);
    logger.info(
      `Confirmation email of customer registration has been sent to ${email}.`
    );
  }

  async process(messageBody) {
    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);
    await this.sendMail(customer.email);
  }
}
export default CustomerRegistrationHandler;
