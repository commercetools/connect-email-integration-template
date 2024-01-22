import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { send } from '../extensions/sendgrid.extension.js';

class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail(senderEmailAddress, templateId, customerDetails) {
    await send(senderEmailAddress, templateId, customerDetails);
  }

  async process(messageBody) {
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.CUSTOMER_REGISTRATION_TEMPLATE_ID;

    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);

    const customerDetails = {
      customerEmail: customer.email,
      customerNumber: customer.customerNumber ? customer.customerNumber : '',
      customerFirstName: customer.firstName ? customer.firstName : '',
      customerMiddleName: customer.middleName ? customer.middleName : '',
      customerLastName: customer.lastName ? customer.lastName : '',
      customerCreationTime: customer.createdAt,
    };

    logger.info(
      `Ready to send confirmation email of customer registration : customerEmail=${customerDetails.customerEmail}, customerNumber=${customerDetails.customerNumber}, customerFirstName=${customerDetails.customerFirstName}, customerLastName=${customerDetails.customerLastName}, customerMiddleName=${customerDetails.customerMiddleName}, customerCreationTime=${customerDetails.customerCreationTime} `
    );
    await this.sendMail(senderEmailAddress, templateId, customerDetails);
    logger.info(
      `Confirmation email of customer registration has been sent to ${customerDetails.customerEmail}.`
    );
  }
}
export default CustomerRegistrationHandler;
