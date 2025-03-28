import DevSMTPProvider from '../../../../../src/services/email/providers/dev-smtp.provider.js';
import { BasicEmailParser } from '../../../../../src/services/email/parsers/basic-email.parser.js';

// Load test environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

describe('DevSMTPProvider Integration', () => {
  let provider;

  beforeAll(() => {
    provider = new DevSMTPProvider();
  });

  it('should send a test email with order details', async () => {
    const orderData = {
      orderNumber: '12345',
      customerEmail: 'test@example.com',
      totalAmount: 79.98,
      date: '03/28/2024',
      items: [
        { name: 'Product 1', price: 29.99 },
        { name: 'Product 2', price: 49.99 }
      ]
    };

    // Create email content
    const emailContent = `
      Order #${orderData.orderNumber}
      Date: ${orderData.date}
      Customer: ${orderData.customerEmail}
      
      Items:
      ${orderData.items.map(item => `${item.name} - $${item.price}`).join('\n')}
      
      Total: $${orderData.totalAmount}
    `;

    // Send email
    await provider.sendEmail({
      from: 'noreply@yourstore.com',
      to: 'test@example.com',
      subject: `Order Confirmation #${orderData.orderNumber}`,
      body: emailContent
    });

    // Note: In a real integration test, you would:
    // 1. Wait for the email to be received by smtp4dev
    // 2. Fetch the email from smtp4dev's API
    // 3. Verify the content matches what we sent
    // 4. Parse the content using our parser and verify the data
  });

  it('should handle email sending errors gracefully', async () => {
    await expect(
      provider.sendEmail({
        from: 'invalid@example.com',
        to: 'invalid@example.com',
        subject: 'Test Error',
        body: 'This should fail'
      })
    ).rejects.toThrow('Failed to send development email');
  });
}); 