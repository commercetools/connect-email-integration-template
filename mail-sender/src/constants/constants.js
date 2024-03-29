export const CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES = ['CustomerCreated'];
export const CUSTOMER_EMAIL_TOKEN_SUBSCRIPTION_MESSAGE_TYPES = [
  'CustomerEmailTokenCreated',
];
export const CUSTOMER_PASSWORD_TOKEN_SUBSCRIPTION_MESSAGE_TYPES = [
  'CustomerPasswordTokenCreated',
];

export const ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE = 'OrderCreated';
export const ORDER_IMPORT_SUBSCRIPTION_MESSAGE_TYPE = 'OrderImported';
export const ORDER_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE = 'OrderStateChanged';
export const ORDER_SHIPMENT_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE =
  'OrderShipmentStateChanged';
export const ORDER_RETURN_INFO_CREATION_SUBSCRIPTION_MESSAGE_TYPE =
  'ReturnInfoAdded';
export const ORDER_RETURN_INFO_UPDATE_SUBSCRIPTION_MESSAGE_TYPE =
  'ReturnInfoSet';

export const ORDER_SUBSCRIPTION_MESSAGE_TYPES = [
  ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_IMPORT_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_SHIPMENT_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_RETURN_INFO_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_RETURN_INFO_UPDATE_SUBSCRIPTION_MESSAGE_TYPE,
];

export const NOTIFICATION_TYPE_RESOURCE_CREATED = 'ResourceCreated';
