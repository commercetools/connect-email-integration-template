import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { getCustomerById } from '../client/query.client.js';
import { generatePasswordResetToken } from '../client/update.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { getTimeDiffInMinute } from '../utils/date.utils.js';
import { EMAIL_TEMPLATE_TYPES } from '../client/email-template.client.js';

class CustomerPasswordTokenCreationHandler extends GenericHandler {
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
    const templateType = EMAIL_TEMPLATE_TYPES['forgot-password'];

    const customerId = messageBody.customerId;
    const customer = await getCustomerById(customerId);
    const generateTokenResult = await generatePasswordResetToken(
      customer.email,
      tokenValidityInMinute
    );

    if (generateTokenResult) {
      if (
        !tokenValidityInMinute &&
        generateTokenResult.createdAt &&
        generateTokenResult.expiresAt
      ) {
        tokenValidityInMinute = getTimeDiffInMinute(
          generateTokenResult.createdAt,
          generateTokenResult.expiresAt
        );
      }
      
      // Estructurar los datos de manera más organizada, pero manteniendo toda la data original
      const templateData = {
        // Incluir el objeto customer completo para que los usuarios tengan acceso a todas sus propiedades
        customer: {
          ...customer,
          // Agregar propiedades formateadas para facilitar su uso en templates
          customerEmail: customer.email,
          customerNumber: customer.customerNumber || '',
          customerFirstName: customer.firstName || '',
          customerMiddleName: customer.middleName || '',
          customerLastName: customer.lastName || '',
          customerCreationTime: customer.createdAt,
          customerPasswordToken: generateTokenResult.value,
          customerPasswordTokenValidity: tokenValidityInMinute,
        }
      };

      logger.info(
        `Ready to send password reset email : customerEmail=${templateData.customer.customerEmail}, customerNumber=${templateData.customer.customerNumber}, customerCreationTime=${templateData.customer.customerCreationTime}`
      );
      await super.sendMail(
        senderEmailAddress,
        customer.email,
        templateType,
        templateData
      );
      logger.info(
        `Password reset email has been sent to ${templateData.customer.customerEmail}.`
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
