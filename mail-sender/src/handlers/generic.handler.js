import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SERVER_ERROR } from '../constants/http-status.constants.js';
import { logger } from '../utils/logger.utils.js';

class GenericHandler {
  async sendMail(
    senderEmailAddress,
    recipientEmailAddress,
    templateId,
    templateData
  ) {
    logger.info(`senderEmailAddress: ${senderEmailAddress}`);
    logger.info(`recipientEmailAddress: ${recipientEmailAddress}`);
    logger.info(`templateId: ${templateId}`);
    logger.info(`templateData: ${templateData}`);
    // Implement the invocation to SDK supplied by email service provider
  }

  process() {
    // Write the actual implementation in inherited handlers
    throw new CustomError(
      HTTP_STATUS_SERVER_ERROR,
      `Missing actual implementation in message handler`
    );
  }
}
export default GenericHandler;
