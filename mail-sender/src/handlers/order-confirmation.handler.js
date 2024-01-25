import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';


class OrderConfirmationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    logger.info(messageBody);
  }
}
export default OrderConfirmationHandler;
