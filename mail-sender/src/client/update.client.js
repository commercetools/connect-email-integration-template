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

export async function generatePasswordResetToken(email) {
  return await createApiRoot()
    .customers()
    .passwordToken()
    .post({
      body: {
        email,
        ttlMinutes: Number(
          process.env.CUSTOMER_PASSWORD_TOKEN_VALIDITY_IN_MINUTE
        ),
      },
    })
    .execute()
    .then((response) => response.body);
}
