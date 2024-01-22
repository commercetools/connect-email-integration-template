import { createApiRoot } from './create.client.js';

export async function generateEmailToken(customerId) {
  return await createApiRoot()
    .customers()
    .emailToken()
    .post({
      body: {
        id: customerId,
        ttlMinutes: Number(process.env.CUSTOMER_EMAIL_TOKEN_VALIDITY_IN_MINUTE),
      },
    })
    .execute()
    .then((response) => response.body);
}
