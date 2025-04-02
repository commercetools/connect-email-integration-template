// Set environment for tests
process.env.NODE_ENV = 'test';
process.env.EMAIL_PROVIDER = 'dev-smtp';
process.env.SENDER_EMAIL_ADDRESS = 'ct@ct.com';

// Mock the configuration
const mockConfig = {
  clientId: 'dummy-client-id',
  clientSecret: 'dummy-client-secret',
  projectKey: 'dummy-project-key',
  scope: 'dummy-scope',
  region: 'dummy-region'
};

jest.mock('../../src/utils/config.utils.js', () => ({
  __esModule: true,
  default: () => mockConfig
}));

// Mock the logger
jest.mock('../../src/utils/logger.utils.js', () => ({
  logger: {
    info: (...args) => {
      // Solo loggear errores y warnings
      if (args[0].includes('ERROR') || args[0].includes('WARN')) {
        console.log(...args);
      }
    },
    error: (...args) => {
      console.error(...args);
    },
    debug: () => {
      // No loggear debug en tests
    }
  }
}));

// Mock the CommerceTools client
jest.mock('../../src/client/query.client.js', () => ({
  getOrderById: jest.fn().mockResolvedValue({
    id: 'test-order-id',
    customerEmail: 'test@example.com',
    orderNumber: 'ORDER-123',
    createdAt: '2024-03-20T10:00:00.000Z',
    lineItems: [
      {
        name: { en: 'Test Product' },
        quantity: 1,
        variant: {
          sku: 'SKU123',
          images: []
        },
        totalPrice: { centAmount: 1000, currencyCode: 'USD' }
      }
    ],
    totalPrice: { centAmount: 1000, currencyCode: 'USD' },
    taxedPrice: { centAmount: 1000, currencyCode: 'USD' }
  }),
  getCustomerById: jest.fn().mockResolvedValue({
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    middleName: '',
    customerNumber: 'CUST123'
  })
}));

// Mock the email template client
jest.mock('../../src/client/email-template.client.js', () => ({
  getEmailTemplateByType: jest.fn().mockResolvedValue({
    subject: 'Test Subject',
    body: JSON.stringify({
      time: 1647781200000,
      blocks: [
        {
          id: '1',
          type: 'paragraph',
          data: {
            text: 'Test Body'
          }
        }
      ],
      version: '2.24.3'
    })
  }),
  EMAIL_TEMPLATE_TYPES: {
    'order-confirmation': 'order-confirmation',
    'shipping-confirmation': 'shipping-confirmation',
    'order-refund': 'order-refund'
  }
}));

// Mock the email provider
export const mockSendEmail = jest.fn().mockResolvedValue({});
jest.mock('../../src/services/email/providers/dev-smtp.provider.js', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      sendEmail: mockSendEmail
    }))
  };
});

// Mock the dynamic import of email providers
jest.mock('../../src/services/email/email.service.factory.js', () => {
  const originalModule = jest.requireActual('../../src/services/email/email.service.factory.js');
  return {
    ...originalModule,
    EmailServiceFactory: {
      ...originalModule.EmailServiceFactory,
      createService: jest.fn().mockImplementation(async (provider) => {
        if (provider === 'dev-smtp') {
          return {
            sendEmail: mockSendEmail
          };
        }
        throw new Error(`Unsupported email provider: ${provider}`);
      })
    }
  };
});

