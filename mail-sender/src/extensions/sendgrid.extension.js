import SendGridMail from '@sendgrid/mail';
import CustomError from '../errors/custom.error.js';

export async function send(
  senderEmailAddress,
  receiverEmailAddress,
  templateId,
  templateData
) {
  try {
    SendGridMail.setApiKey(process.env.EMAIL_PROVIDER_API_KEY);
    const msg = {
      to: receiverEmailAddress,
      from: senderEmailAddress,
      templateId,
      dynamicTemplateData: templateData,
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
