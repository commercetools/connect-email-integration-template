// import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { send } from '../extensions/sendgrid.extension.js';
import { generateEmailToken } from '../client/update.client.js';

class CustomerEmailTokenCreationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail(senderEmailAddress, templateId, customerDetails) {
    await send(senderEmailAddress, templateId, customerDetails);
  }

  async process(messageBody) {
    // const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    // const templateId = process.env.CUSTOMER_REGISTRATION_TEMPLATE_ID;

    const customerId = messageBody.resource.id;
    // const customer = await getCustomerById(customerId);
    const generateTokenResult = await generateEmailToken(customerId);
    if (generateTokenResult) logger.info('Completed token regeneration');
  }
}
export default CustomerEmailTokenCreationHandler;
