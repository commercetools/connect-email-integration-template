import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { send } from '../extensions/sendgrid.extension.js';
import { getCustomerById } from '../client/query.client.js';
import { generatePasswordResetToken } from '../client/update.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';

class CustomerPasswordTokenCreationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail(senderEmailAddress, templateId, customerDetails) {
    await send(senderEmailAddress, templateId, customerDetails);
  }

  async process(messageBody) {
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.CUSTOMER_PASSWORD_TOKEN_CREATION_TEMPLATE_ID;

    const customerId = messageBody.customerId;
    const customer = await getCustomerById(customerId);
    const generateTokenResult = await generatePasswordResetToken(
      customer.email
    );

    if (generateTokenResult) {
      const customerDetails = {
        customerEmail: customer.email,
        customerNumber: customer.customerNumber ? customer.customerNumber : '',
        customerFirstName: customer.firstName ? customer.firstName : '',
        customerMiddleName: customer.middleName ? customer.middleName : '',
        customerLastName: customer.lastName ? customer.lastName : '',
        customerCreationTime: customer.createdAt,
        customerPasswordToken: generateTokenResult.value,
        customerPasswordTokenValidity:
          process.env.CUSTOMER_PASSWORD_TOKEN_VALIDITY_IN_MINUTE,
      };
      logger.info(
        `Ready to send password reset email : customerEmail=${customerDetails.customerEmail}, customerNumber=${customerDetails.customerNumber}, customerFirstName=${customerDetails.customerFirstName}, customerLastName=${customerDetails.customerLastName}, customerMiddleName=${customerDetails.customerMiddleName}, customerCreationTime=${customerDetails.customerCreationTime} `
      );
      await this.sendMail(senderEmailAddress, templateId, customerDetails);
      logger.info(
        `Password reset email has been sent to ${customerDetails.customerEmail}.`
      );
    } else {
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        `Unable to generate token with customer ID ${customerId}`
      );
    }
  }
}
export default CustomerPasswordTokenCreationHandler;
