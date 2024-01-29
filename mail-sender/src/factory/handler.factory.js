import {
  HANDLER_TYPE_CUSTOMER_REGISTRATION,
  HANDLER_TYPE_CUSTOMER_EMAIL_TOKEN_CREATION,
  HANDLER_TYPE_CUSTOMER_PASSWORD_TOKEN_CREATION,
  HANDLER_TYPE_ORDER_CONFIRMATION,
  HANDLER_TYPE_ORDER_STATE_CHANGE,
} from '../constants/handler-type.constants.js';
import CustomerRegistrationHandler from '../handlers/customer-registration.handler.js';
import CustomerEmailTokenCreationHandler from '../handlers/customer-email-token-creation.handler.js';
import CustomerPasswordTokenCreationHandler from '../handlers/customer-password-token-creation.handler.js';
import OrderConfirmationHandler from '../handlers/order-confirmation.handler.js';
import OrderStateChangeHandler from '../handlers/order-state-change.handler.js';

class HandlerFactory {
  constructor() {}
  getHandler(handlerType) {
    if (HANDLER_TYPE_CUSTOMER_REGISTRATION === handlerType) {
      return new CustomerRegistrationHandler();
    } else if (HANDLER_TYPE_CUSTOMER_EMAIL_TOKEN_CREATION === handlerType) {
      return new CustomerEmailTokenCreationHandler();
    } else if (HANDLER_TYPE_CUSTOMER_PASSWORD_TOKEN_CREATION === handlerType) {
      return new CustomerPasswordTokenCreationHandler();
    } else if (HANDLER_TYPE_ORDER_CONFIRMATION === handlerType) {
      return new OrderConfirmationHandler();
    } else if (HANDLER_TYPE_ORDER_STATE_CHANGE === handlerType) {
      return new OrderStateChangeHandler();
    }
  }
}
export default HandlerFactory;
