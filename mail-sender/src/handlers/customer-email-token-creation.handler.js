import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { getCustomerById } from '../client/query.client.js';
import { generateEmailToken } from '../client/update.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { getTimeDiffInMinute } from '../utils/date.utils.js';
import { EMAIL_TEMPLATE_TYPES } from '../client/email-template.client.js';

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
    const templateType = EMAIL_TEMPLATE_TYPES['create-account-verification'];

    const customerId = messageBody.customerId;
    const customer = await getCustomerById(customerId);
    const generateTokenResult = await generateEmailToken(
      customerId,
      tokenValidityInMinute
    );

    if (generateTokenResult) {
      const templateData = {
        customer: {
          ...customer,
          customerEmail: customer.email,
          customerNumber: customer.customerNumber || '',
          customerFirstName: customer.firstName || '',
          customerMiddleName: customer.middleName || '',
          customerLastName: customer.lastName || '',
          customerCreationTime: customer.createdAt,
          customerEmailToken: generateTokenResult.value,
          customerEmailTokenValidity: tokenValidityInMinute,
        }
      };

      logger.info(
        `Ready to send verification email of customer email token creation : customerEmail=${templateData.customer.customerEmail}, customerNumber=${templateData.customer.customerNumber}, customerCreationTime=${templateData.customer.customerCreationTime}`
      );
      await super.sendMail(
        senderEmailAddress,
        customer.email,
        templateType,
        templateData
      );
      logger.info(
        `Verification email of customer email token has been sent to ${templateData.customer.customerEmail}.`
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
