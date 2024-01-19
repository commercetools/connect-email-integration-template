import SendGridMail from '@sendgrid/mail';
import CustomError from '../errors/custom.error.js';

export async function send(
  customerEmail,
  customerNumber,
  customerFirstName,
  customerLastName,
  customerMiddleName,
  customerCreationTime,
  senderEmailAddress,
  templateId
) {
  try {
    SendGridMail.setApiKey(process.env.EMAIL_PROVIDER_API_KEY);
    const msg = {
      to: customerEmail,
      from: senderEmailAddress,
      templateId,
      dynamicTemplateData: {
        firstName: customerFirstName,
        lastName: customerLastName,
        middleName: customerMiddleName,
        customerNumber: customerNumber,
        creationTime: customerCreationTime,
      },
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
