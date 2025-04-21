import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { EMAIL_TEMPLATE_TYPES } from '../client/email-template.client.js';

class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateType = EMAIL_TEMPLATE_TYPES['create-account-confirmation'];

    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);
    if (customer) {
      const templateData = {
        customer: {
          ...customer,
          customerEmail: customer.email,
          customerNumber: customer.customerNumber || '',
          customerFirstName: customer.firstName || '',
          customerMiddleName: customer.middleName || '',
          customerLastName: customer.lastName || '',
          customerCreationTime: customer.createdAt,
        }
      };

      logger.info(
        `Ready to send confirmation email of customer registration : customerEmail=${templateData.customer.customerEmail}, customerNumber=${templateData.customer.customerNumber}, customerCreationTime=${templateData.customer.customerCreationTime}`
      );
      await super.sendMail(
        senderEmailAddress,
        customer.email,
        templateType,
        templateData
      );
      logger.info(
        `Confirmation email of customer registration has been sent to ${templateData.customer.customerEmail}.`
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
