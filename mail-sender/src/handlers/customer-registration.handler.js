import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { send } from '../extensions/sendgrid.extension.js';

class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.CUSTOMER_REGISTRATION_TEMPLATE_ID;

    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);
    const customerEmail = customer.email;
    const customerNumber = customer.customerNunmber;
    const customerFirstName = customer.firstName;
    const customerMiddleName = customer.middleName;
    const customerLastName = customer.lastName;
    const customerCreationTime = customer.createdAt;

    logger.info(
      `Ready to send confirmation email of customer registration : customerEmail=${customerEmail}, customerNumber=${customerNumber}, customerFirstName=${customerFirstName}, customerLastName=${customerLastName}, customerMiddleName=${customerMiddleName}, customerCreationTime=${customerCreationTime} `
    );
    await send(
      customerEmail,
      customerNumber,
      customerFirstName,
      customerLastName,
      customerMiddleName,
      customerCreationTime,
      senderEmailAddress,
      templateId
    );
    logger.info(
      `Confirmation email of customer registration has been sent to ${customerEmail}.`
    );
  }
}
export default CustomerRegistrationHandler;
