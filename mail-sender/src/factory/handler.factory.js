import { HANDLER_TYPE_CUSTOMER_REGISTRATION } from '../constants/handler-type.constants.js';
import CustomerRegistrationHandler from '../handlers/customer-registration.handler.js';
class HandlerFactory {
  constructor() {}
  getHandler(handlerType) {
    if (HANDLER_TYPE_CUSTOMER_REGISTRATION === handlerType) {
      return new CustomerRegistrationHandler();
    }
  }
}
export default HandlerFactory;
