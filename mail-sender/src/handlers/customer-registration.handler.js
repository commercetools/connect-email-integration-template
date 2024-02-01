import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';

class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.CUSTOMER_REGISTRATION_TEMPLATE_ID;

    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);
    if (customer) {
      const customerDetails = {
        customerEmail: customer.email,
        customerNumber: customer.customerNumber ? customer.customerNumber : '',
        customerFirstName: customer.firstName ? customer.firstName : '',
        customerMiddleName: customer.middleName ? customer.middleName : '',
        customerLastName: customer.lastName ? customer.lastName : '',
        customerCreationTime: customer.createdAt,
      };

      logger.info(
        `Ready to send confirmation email of customer registration : customerEmail=${customerDetails.customerEmail}, customerNumber=${customerDetails.customerNumber},  customerCreationTime=${customerDetails.customerCreationTime} `
      );
      await super.sendMail(
        senderEmailAddress,
        customer.email,
        templateId,
        customerDetails
      );
      logger.info(
        `Confirmation email of customer registration has been sent to ${customerDetails.customerEmail}.`
      );
    } else {
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        `Unable to fetch customer data by customer ID ${customerId}.`
      );
    }
  }
}
export default CustomerRegistrationHandler;
