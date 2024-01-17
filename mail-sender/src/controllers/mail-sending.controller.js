import { logger } from '../utils/logger.utils.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http-status.constants.js';
import {
  doValidation,
  isCustomerSubscriptionMessage,
} from '../validators/message.validators.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import CustomerRegistrationHandler from '../handlers/customer-registration.handler.js';
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

    if (isCustomerSubscriptionMessage(messageBody)) {
      let customerRegistrationHandler = new CustomerRegistrationHandler();
      await customerRegistrationHandler.process(messageBody);
    }
  } catch (err) {
    if (err.statusCode !== HTTP_STATUS_SUCCESS_ACCEPTED) {
      logger.error(err);
    } else {
      logger.info(err);
    }
  }
};
