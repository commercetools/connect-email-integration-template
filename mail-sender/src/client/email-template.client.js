import { createApiRoot } from './create.client.js';

const CONTAINER_NAME = 'email-templates';

export async function getEmailTemplateByType(templateType) {
  try {
    const response = await createApiRoot()
      .customObjects()
      .get({
        queryArgs: {
          where: `container = "${CONTAINER_NAME}" AND value(type = "${templateType}")`,
        },
      })
      .execute();

    if (response.body.results && response.body.results.length > 0) {
      return response.body.results[0].value;
    }

    throw new Error(`No template found for type: ${templateType}`);
  } catch (error) {
    console.error(`Error fetching email template for type ${templateType}:`, error);
    throw error;
  }
}

// Map of email types to their corresponding template types in commerceTools custom objects
export const EMAIL_TEMPLATE_TYPES = {
  'create-account-confirmation': 'create-account-confirmation',
  'create-account-verification': 'create-account-verification',
  'forgot-password': 'forgot-password',
  'order-confirmation': 'order-confirmation',
  'shipping-confirmation': 'shipping-confirmation',
  'order-refund': 'order-refund',
}; 