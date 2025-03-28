import { createApiRoot } from './create.client.js';
import * as devClient from './dev-clients/dev.query.client.js';

const isDevelopment = process.env.NODE_ENV === 'development';

export async function getCustomerById(customerId) {
  if (isDevelopment) {
    return devClient.getCustomerById(customerId);
  }
  
  return await createApiRoot()
    .customers()
    .withId({
      ID: customerId,
    })
    .get()
    .execute()
    .then((response) => response.body);
}

export async function getOrderById(orderId) {
  if (isDevelopment) {
    return devClient.getOrderById(orderId);
  }

  return await createApiRoot()
    .orders()
    .withId({
      ID: orderId,
    })
    .get()
    .execute()
    .then((response) => response.body);
}
