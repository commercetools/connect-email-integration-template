import { HANDLER_TYPE_CUSTOMER_REGISTRATION } from '../constants/handler-type.constants.js';
import CustomerRegistrationHandler from '../handlers/customer-registration.handler.js';
import CustomerEmailTokenCreationHandler from '../handlers/customer-email-token-creation.handler.js';
import { HANDLER_TYPE_CUSTOMER_EMAIL_TOKEN_CREATION } from '../constants/handler-type.constants.js';
class HandlerFactory {
  constructor() {}
  getHandler(handlerType) {
    if (HANDLER_TYPE_CUSTOMER_REGISTRATION === handlerType) {
      return new CustomerEmailTokenCreationHandler();
    } else if (HANDLER_TYPE_CUSTOMER_EMAIL_TOKEN_CREATION === handlerType) {
      return new CustomerRegistrationHandler();
    }
  }
}
export default HandlerFactory;
