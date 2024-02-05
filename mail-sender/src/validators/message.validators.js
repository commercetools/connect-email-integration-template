import CustomError from '../errors/custom.error.js';
import {
  CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES,
  CUSTOMER_EMAIL_TOKEN_SUBSCRIPTION_MESSAGE_TYPES,
  CUSTOMER_PASSWORD_TOKEN_SUBSCRIPTION_MESSAGE_TYPES,
  ORDER_SUBSCRIPTION_MESSAGE_TYPES,
  NOTIFICATION_TYPE_RESOURCE_CREATED,
  ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_IMPORT_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_SHIPMENT_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_RETURN_INFO_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_RETURN_INFO_UPDATE_SUBSCRIPTION_MESSAGE_TYPE,
} from '../constants/constants.js';

import { decodeToJson } from '../utils/decoder.utils.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http-status.constants.js';
import readConfiguration from '../utils/config.utils.js';

export function isSelfCreatedChange(messageBody) {
  const resourceModifiedBy = messageBody.createdBy?.clientId;
  const currentConnectorClientId = readConfiguration().clientId;
  return resourceModifiedBy === currentConnectorClientId;
}

export function isCustomerSubscriptionMessage(messageBody) {
  return CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES.includes(messageBody.type);
}
export function isCustomerEmailTokenSubscriptionMessage(messageBody) {
  return CUSTOMER_EMAIL_TOKEN_SUBSCRIPTION_MESSAGE_TYPES.includes(
    messageBody.type
  );
}
export function isCustomerPasswordTokenSubscriptionMessage(messageBody) {
  return CUSTOMER_PASSWORD_TOKEN_SUBSCRIPTION_MESSAGE_TYPES.includes(
    messageBody.type
  );
}
export function isOrderSubscriptionMessage(messageBody) {
  return ORDER_SUBSCRIPTION_MESSAGE_TYPES.includes(messageBody.type);
}

export function isOrderConfirmationMessage(messageBody) {
  return [
    ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
    ORDER_IMPORT_SUBSCRIPTION_MESSAGE_TYPE,
  ].includes(messageBody.type);
}

export function isOrderStateChangeMessage(messageBody) {
  return [
    ORDER_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
    ORDER_SHIPMENT_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
  ].includes(messageBody.type);
}

export function isOrderRefundMessage(messageBody) {
  return [
    ORDER_RETURN_INFO_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
    ORDER_RETURN_INFO_UPDATE_SUBSCRIPTION_MESSAGE_TYPE,
  ].includes(messageBody.type);
}

function isValidMessageType(messageBody) {
  return (
    isCustomerSubscriptionMessage(messageBody) ||
    isCustomerEmailTokenSubscriptionMessage(messageBody) ||
    isCustomerPasswordTokenSubscriptionMessage(messageBody) ||
    isOrderSubscriptionMessage(messageBody)
  );
}

export function doValidation(request) {
  if (!request.body) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: No Pub/Sub message was received'
    );
  }

  // Check if the body comes in a message
  if (!request.body.message) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: Wrong No Pub/Sub message format - Missing body message'
    );
  }

  if (!request.body.message.data) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: Wrong No Pub/Sub message format - Missing data in body message'
    );
  }
  const encodedMessageBody = request.body.message.data;
  const messageBody = decodeToJson(encodedMessageBody);

  // Make sure incoming message contains correct notification type
  if (NOTIFICATION_TYPE_RESOURCE_CREATED === messageBody.notificationType) {
    throw new CustomError(
      HTTP_STATUS_SUCCESS_ACCEPTED,
      `Incoming message is about subscription resource creation. Skip handling the message.`
    );
  }

  if (!isValidMessageType(messageBody)) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      `Message type ${messageBody.type} is incorrect.`
    );
  }

  // Make sure incoming message contains the identifier of the changed resources
  const resourceTypeId = messageBody?.resource?.typeId;
  const resourceId = messageBody?.resource?.id;

  if (
    isCustomerSubscriptionMessage(messageBody) &&
    (resourceTypeId !== 'customer' || !resourceId)
  ) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      ` No customer ID is found in message.`
    );
  }

  if (isOrderSubscriptionMessage(messageBody)) {
    if (resourceTypeId !== 'order' || !resourceId) {
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        ` No order ID is found in message.`
      );
    }
    if (
      messageBody.order &&
      !messageBody.order?.customerId &&
      !messageBody.order?.customerEmail
    ) {
      throw new CustomError(
        HTTP_STATUS_SUCCESS_ACCEPTED,
        `Order (ID=${resourceId}) does not link to any customer contact. Skip handling the message.`
      );
    }
  }

  if (isSelfCreatedChange(messageBody)) {
    throw new CustomError(
      HTTP_STATUS_SUCCESS_ACCEPTED,
      `Incoming message (ID=${messageBody.id}) is about change of ${messageBody.type} created by the current connector. Skip handling the message.`
    );
  }
}
