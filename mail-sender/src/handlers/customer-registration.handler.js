import { getCustomerById } from '../client/query.client.js';
import GenericHandler from '../handlers/generic.handler.js';
class CustomerRegistrationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async sendMail() {
    // TODO : Implement integration to external email service provider
  }

  async process(messageBody) {
    const customerId = messageBody.resource.id;
    const customer = await getCustomerById(customerId);
    await this.sendMail(customer.email);
  }
}
export default CustomerRegistrationHandler;
