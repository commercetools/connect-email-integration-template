import { mockOrder } from '../../mocks/order.mock.js';
import { mockCustomer } from '../../mocks/customer.mock.js';
import { logger } from '../../utils/logger.utils.js';

export async function getCustomerById(customerId) {
  logger.info(`[DEV] Getting customer with ID: ${customerId}`);
  return mockCustomer;
}

export async function getOrderById(orderId) {
  logger.info(`[DEV] Getting order with ID: ${orderId}`);
  return mockOrder;
} 