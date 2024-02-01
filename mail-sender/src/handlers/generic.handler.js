import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SERVER_ERROR } from '../constants/http-status.constants.js';
import { send } from '../extensions/sendgrid.extension.js';

class GenericHandler {
  async sendMail(
    senderEmailAddress,
    recipientEmailAddress,
    templateId,
    templateData
  ) {
    await send(
      senderEmailAddress,
      recipientEmailAddress,
      templateId,
      templateData
    );
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
