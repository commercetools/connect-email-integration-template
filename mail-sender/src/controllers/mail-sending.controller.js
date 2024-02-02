import { logger } from '../utils/logger.utils.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http-status.constants.js';
import {
  doValidation,
  isCustomerSubscriptionMessage,
  isCustomerEmailTokenSubscriptionMessage,
  isCustomerPasswordTokenSubscriptionMessage,
  isOrderConfirmationMessage,
  isOrderStateChangeMessage,
  isOrderRefundMessage,
} from '../validators/message.validators.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import HandlerFactory from '../factory/handler.factory.js';
import {
  HANDLER_TYPE_CUSTOMER_REGISTRATION,
  HANDLER_TYPE_CUSTOMER_EMAIL_TOKEN_CREATION,
  HANDLER_TYPE_CUSTOMER_PASSWORD_TOKEN_CREATION,
  HANDLER_TYPE_ORDER_CONFIRMATION,
  HANDLER_TYPE_ORDER_STATE_CHANGE,
  HANDLER_TYPE_ORDER_REFUND,
} from '../constants/handler-type.constants.js';

/**
 * Exposed event POST endpoint.
 * Receives the Pub/Sub message and works with it
 *
 * @typedef {import("express").Response} Response
 * @typedef {import("express").Request} Request
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const messageHandler = async (request, response) => {
  // Send ACCEPTED acknowledgement to Subscription
  response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send();

  try {
    // Check request body
    doValidation(request);

    const encodedMessageBody = request.body.message.data;
    const messageBody = decodeToJson(encodedMessageBody);
    const handlerFactory = new HandlerFactory();
    let handler;
    if (isCustomerSubscriptionMessage(messageBody)) {
      handler = handlerFactory.getHandler(HANDLER_TYPE_CUSTOMER_REGISTRATION);
    } else if (isCustomerEmailTokenSubscriptionMessage(messageBody)) {
      handler = handlerFactory.getHandler(
        HANDLER_TYPE_CUSTOMER_EMAIL_TOKEN_CREATION
      );
    } else if (isCustomerPasswordTokenSubscriptionMessage(messageBody)) {
      handler = handlerFactory.getHandler(
        HANDLER_TYPE_CUSTOMER_PASSWORD_TOKEN_CREATION
      );
    } else if (isOrderConfirmationMessage(messageBody)) {
      handler = handlerFactory.getHandler(HANDLER_TYPE_ORDER_CONFIRMATION);
    } else if (isOrderStateChangeMessage(messageBody)) {
      handler = handlerFactory.getHandler(HANDLER_TYPE_ORDER_STATE_CHANGE);
    } else if (isOrderRefundMessage(messageBody)) {
      handler = handlerFactory.getHandler(HANDLER_TYPE_ORDER_REFUND);
    }
    await handler.process(messageBody);
  } catch (err) {
    if (err.statusCode !== HTTP_STATUS_SUCCESS_ACCEPTED) {
      logger.error(err);
    } else {
      logger.info(err);
    }
  }
};
