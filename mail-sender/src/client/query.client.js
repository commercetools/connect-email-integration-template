import { createApiRoot } from './create.client.js';

export async function getCustomerById(customerId) {
  return await createApiRoot()
    .customers()
    .withId({
      ID: customerId,
    })
    .get()
    .execute()
    .then((response) => response.body);
}
