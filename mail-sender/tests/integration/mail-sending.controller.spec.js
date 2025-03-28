// Set environment for tests
process.env.NODE_ENV = 'development';

// Mock configuration before any imports
jest.mock('src/utils/config.utils.js', () => ({
  __esModule: true,
  default: () => ({
    clientId: 'dummy-client-id-24-chars',
    clientSecret: 'dummy-client-secret-32-chars-long',
    projectKey: 'dummy-project-key',
    scope: 'dummy-scope',
    region: 'us-central1.gcp'
  })
}));

import { expect, describe, afterAll, it } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import eventRouter from 'src/routes/mail-sending.route.js';
import { logger } from 'src/utils/logger.utils.js';
import DevSMTPProvider from 'src/services/email/providers/dev-smtp.provider.js';
import { EmailServiceFactory } from 'src/services/email/email.service.factory.js';

// Mock the logger to avoid console output during tests
jest.mock('src/utils/logger.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock CommerceTools client
jest.mock('src/client/query.client.js', () => ({
  getOrderById: jest.fn().mockResolvedValue({
    id: 'dummy-product-id',
    orderNumber: 'dummy-order-number',
    customerId: 'dummy-customer-id',
    customerEmail: 'test@example.com',
    lineItems: [
      {
        name: { 'en-US': 'Test Product' },
        quantity: 1,
        variant: {
          sku: 'TEST-SKU',
          images: [{ url: 'http://example.com/image.jpg' }]
        },
        totalPrice: { centAmount: 1000 }
      }
    ]
  }),
  getCustomerById: jest.fn().mockResolvedValue({
    id: 'dummy-customer-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  })
}));

// Mock email template client
jest.mock('src/client/email-template.client.js', () => ({
  getEmailTemplateByType: jest.fn().mockResolvedValue({
    subject: 'Test Subject',
    body: 'Test Body'
  }),
  EMAIL_TEMPLATE_TYPES: {
    'order-confirmation': 'order-confirmation'
  }
}));

// Mock email service to use real DevSMTPProvider
jest.mock('src/services/email/email.service.factory.js', () => {
  const { default: DevSMTPProvider } = jest.requireActual('src/services/email/providers/dev-smtp.provider.js');
  const mockProvider = new DevSMTPProvider();
  mockProvider.sendEmail = jest.fn();
  return {
    EmailServiceFactory: {
      createService: jest.fn().mockImplementation(async () => {
        return mockProvider;
      })
    }
  };
});

describe('mail-sending.controller.spec', () => {
  let app;
  let server;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/mail-sending', eventRouter);
    server = app.listen(0); // Use random port for testing
  });

  afterAll((done) => {
    server.close(done);
  });

  it('When resource identifier is absent in URL, it should returns 404 http status', async () => {
    const response = await request(app)
      .post('/mail-sending/')
      .send({
        notificationType: 'Message',
        resource: {
          typeId: 'order',
          id: 'dummy-product-id'
        },
        type: 'OrderCreated',
        resourceUserProvidedIdentifiers: {
          orderNumber: 'dummy-order-number'
        },
        version: 11,
        oldVersion: 10,
        modifiedAt: '2023-09-12T00:00:00.000Z'
      });

    expect(response.status).toBe(404);
  });

  it('When payload body does not exist, it should returns 202 http status', async () => {
    const response = await request(app)
      .post('/mail-sending/mailSender')
      .send({});

    expect(response.status).toBe(202);
  });

  it('When payload body exists without correct order ID, it should returns 202 http status', async () => {
    const response = await request(app)
      .post('/mail-sending/mailSender')
      .send({
        notificationType: 'Message',
        resource: {
          typeId: 'order',
          id: 'non-existent-id'
        },
        type: 'OrderCreated',
        resourceUserProvidedIdentifiers: {
          orderNumber: 'dummy-order-number'
        },
        version: 11,
        oldVersion: 10,
        modifiedAt: '2023-09-12T00:00:00.000Z'
      });

    expect(response.status).toBe(202);
  });

  it('When order confirmation message is received, it should process and send confirmation email', async () => {
    const response = await request(app)
      .post('/mail-sending/mailSender')
      .send({
        notificationType: 'Message',
        resource: {
          typeId: 'order',
          id: 'dummy-product-id'
        },
        type: 'OrderCreated',
        resourceUserProvidedIdentifiers: {
          orderNumber: 'dummy-order-number'
        },
        version: 11,
        oldVersion: 10,
        modifiedAt: '2023-09-12T00:00:00.000Z'
      });

    expect(response.status).toBe(202);
    
    // Verify that the email service was called with correct parameters
    const emailService = await EmailServiceFactory.createService();
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.SENDER_EMAIL_ADDRESS,
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body'
      })
    );
  });
});
