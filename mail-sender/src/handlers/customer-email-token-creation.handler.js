import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { getCustomerById } from '../client/query.client.js';
import { generateEmailToken } from '../client/update.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { getTimeDiffInMinute } from '../utils/date.utils.js';

class CustomerEmailTokenCreationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    let tokenValidityInMinute;
    if (messageBody.createdAt && messageBody.expiresAt) {
      tokenValidityInMinute = getTimeDiffInMinute(
        messageBody.createdAt,
        messageBody.expiresAt
      );
    }

    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.CUSTOMER_EMAIL_TOKEN_CREATION_TEMPLATE_ID;

    const customerId = messageBody.customerId;
    const customer = await getCustomerById(customerId);
    const generateTokenResult = await generateEmailToken(
      customerId,
      tokenValidityInMinute
    );

    if (generateTokenResult) {
      const customerDetails = {
        customerEmail: customer.email,
        customerNumber: customer.customerNumber ? customer.customerNumber : '',
        customerFirstName: customer.firstName ? customer.firstName : '',
        customerMiddleName: customer.middleName ? customer.middleName : '',
        customerLastName: customer.lastName ? customer.lastName : '',
        customerCreationTime: customer.createdAt,
        customerEmailToken: generateTokenResult.value,
        customerEmailTokenValidity: tokenValidityInMinute,
      };
      logger.info(
        `Ready to send verification email of customer email token creation : customerEmail=${customerDetails.customerEmail}, customerNumber=${customerDetails.customerNumber}, customerCreationTime=${customerDetails.customerCreationTime} `
      );
      await super.sendMail(
        senderEmailAddress,
        customer.email,
        templateId,
        customerDetails
      );
      logger.info(
        `Verification email of customer email token has been sent to ${customerDetails.customerEmail}.`
      );
    } else {
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        `Unable to generate token with customer ID ${customerId}`
      );
    }
  }
}
export default CustomerEmailTokenCreationHandler;
