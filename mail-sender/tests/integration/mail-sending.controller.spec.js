import express from 'express';
import request from 'supertest';
import router from '../../src/routes/mail-sending.route.js';
import { mockSendEmail } from './jest.setup.js';

// Create test app
const app = express();
app.use(express.json());
app.use(router);

describe('mail-sending.controller.spec', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('When resource identifier is absent in URL, it should returns 404 http status', async () => {
    const response = await request(app)
      .post('/')
      .send({});

    expect(response.status).toBe(404);
  });

  it('When payload body does not exist, it should returns 202 http status', async () => {
    const response = await request(app)
      .post('/mailSender')
      .send({});

    expect(response.status).toBe(202);
  });

  it('When payload body exists without correct order ID, it should returns 202 http status', async () => {
    const message = {
      resource: {
        typeId: 'order',
        id: 'non-existent-order-id'
      }
    };
    const response = await request(app)
      .post('/mailSender')
      .send({
        message: {
          data: Buffer.from(JSON.stringify(message)).toString('base64')
        }
      });

    expect(response.status).toBe(202);
  });

  it('When order confirmation message is received, it should process and send confirmation email', async () => {
    const message = {
      notificationType: 'Message',
      resource: {
        typeId: 'order',
        id: 'test-order-id'
      },
      type: 'OrderCreated',
      resourceUserProvidedIdentifiers: {
        orderNumber: 'dummy-order-number'
      },
      version: 1,
      oldVersion: 0,
      modifiedAt: '2024-03-20T10:00:00.000Z'
    };

    const response = await request(app)
      .post('/mailSender')
      .send({
        message: {
          data: Buffer.from(JSON.stringify(message)).toString('base64')
        }
      });

    expect(response.status).toBe(202);
    
    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(mockSendEmail).toHaveBeenCalledWith({
      from: 'ct@ct.com',
      to: 'test@example.com',
      subject: 'Test Subject',
      body: '<p>Test Body</p>'
    });
  });
});
