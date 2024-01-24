import SendGridMail from '@sendgrid/mail';
import CustomError from '../errors/custom.error.js';

export async function send(senderEmailAddress, templateId, customerDetails) {
  try {
    SendGridMail.setApiKey(process.env.EMAIL_PROVIDER_API_KEY);
    const msg = {
      to: customerDetails.customerEmail,
      from: senderEmailAddress,
      templateId,
      dynamicTemplateData: customerDetails,
    };
    await SendGridMail.send(msg);
  } catch (err) {
    const statusCode = err?.code;
    const errors = JSON.stringify(err.response?.body?.errors);

    throw new CustomError(
      statusCode,
      'Fail to communicate with SendGrid.',
      errors
    );
  }
}
