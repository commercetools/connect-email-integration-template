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

export async function generatePasswordResetToken(email, ttlMinutes) {
  const requestBody = {
    body: {
      email,
    },
  };
  if (ttlMinutes) {
    requestBody.body.ttlMinutes = ttlMinutes;
  }

  return await createApiRoot()
    .customers()
    .passwordToken()
    .post(requestBody)
    .execute()
    .then((response) => response.body);
}
