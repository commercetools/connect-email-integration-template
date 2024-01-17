import { logger } from '../utils/logger.utils.js';
import {
  HTTP_STATUS_SUCCESS_ACCEPTED,
  HTTP_STATUS_BAD_REQUEST,
} from '../constants/http-status.constants.js';
import { doValidation } from '../validators/message.validators';

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
  } catch (err) {
    if (err.statusCode === HTTP_STATUS_BAD_REQUEST) {
      logger.error(err);
    } else {
      logger.info(err);
    }
  }
};
