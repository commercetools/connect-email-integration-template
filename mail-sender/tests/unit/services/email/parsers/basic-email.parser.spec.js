import { BasicEmailParser } from '../../../../../../src/services/email/parsers/basic-email.parser.js';

// Mock the config utils to avoid CommerceTools configuration errors
jest.mock('../../../../../../src/utils/config.utils.js', () => ({
  readConfiguration: () => ({
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    projectKey: 'mock-project-key',
    region: 'mock-region'
  })
}));

describe('BasicEmailParser', () => {
  it('should parse order details from email content', () => {
    const emailContent = `
      Order #12345
      Date: 03/28/2024
      Customer: john.doe@example.com
      
      Items:
      Product 1 - $29.99
      Product 2 - $49.99
      
      Total: $79.98
    `;

    const result = BasicEmailParser.parse(emailContent);

    expect(result).toEqual({
      orderNumber: '12345',
      customerEmail: 'john.doe@example.com',
      totalAmount: 79.98,
      date: '03/28/2024',
      items: [
        { name: 'Product 1', price: 29.99 },
        { name: 'Product 2', price: 49.99 }
      ]
    });
  });

  it('should handle missing information gracefully', () => {
    const emailContent = `
      Some random content
      without order details
    `;

    const result = BasicEmailParser.parse(emailContent);

    expect(result).toEqual({
      orderNumber: null,
      customerEmail: null,
      totalAmount: null,
      date: null,
      items: []
    });
  });

  it('should handle different price formats', () => {
    const emailContent = `
      Order #12345
      Item 1 - $10.00
      Item 2 - 20.50
      Total: 30.50
    `;

    const result = BasicEmailParser.parse(emailContent);

    expect(result.items).toEqual([
      { name: 'Item 1', price: 10.00 },
      { name: 'Item 2', price: 20.50 }
    ]);
    expect(result.totalAmount).toBe(30.50);
  });
}); 