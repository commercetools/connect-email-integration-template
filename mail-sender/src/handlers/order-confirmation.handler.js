import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { getOrderById, getCustomerById } from '../client/query.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { convertMoneyToText } from '../utils/money.utils.js';
import { addImageSizeSuffix } from '../utils/image.utils.js';
import { IMAGE_SIZE_SMALL } from '../constants/image.constants.js';
import { EMAIL_TEMPLATE_TYPES } from '../client/email-template.client.js';

const DEFAULT_LOCALE = 'en-US';
class OrderConfirmationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    logger.info(JSON.stringify(messageBody));
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateType = EMAIL_TEMPLATE_TYPES['order-confirmation'];

    const orderId = messageBody.resource.id;
    const order = await getOrderById(orderId);
    if (order) {
      let customer;
      if (order.customerId) {
        customer = await getCustomerById(order.customerId);
      }

      const orderLineItems = [];

      for (const lineItem of order.lineItems) {
        const item = {
          productName: lineItem.name[DEFAULT_LOCALE],
          productQuantity: lineItem.quantity,
          productSku: lineItem.variant?.sku || '',
          productImage: lineItem.variant?.images?.length > 0
            ? addImageSizeSuffix(
                lineItem.variant.images[0].url,
                IMAGE_SIZE_SMALL
              )
            : '',
          productSubTotal: convertMoneyToText(lineItem.totalPrice),
        };
        orderLineItems.push(item);
      }

      const templateData = {
        order: {
          ...order,
          orderNumber: order.orderNumber || '',
          orderId: order.id,
          orderCreationTime: order.createdAt,
          orderTotalPrice: convertMoneyToText(order.totalPrice),
          orderTaxedPrice: order.taxedPrice ? convertMoneyToText(order.taxedPrice) : '',
          orderState: order.orderState,
          orderShipmentState: order.shipmentState,
          orderLineItems: orderLineItems,
        },
        customer: customer ? {
          ...customer,
          customerEmail: customer.email,
          customerNumber: customer.customerNumber || '',
          customerFirstName: customer.firstName || '',
          customerMiddleName: customer.middleName || '',
          customerLastName: customer.lastName || '',
        } : null
      };

      logger.info(
        `Ready to send order confirmation email : orderNumber=${templateData.order.orderNumber}, customerEmail=${templateData.customer?.customerEmail}`
      );
      await super.sendMail(
        senderEmailAddress,
        templateData.customer?.customerEmail || order.customerEmail,
        templateType,
        templateData
      );
      logger.info(
        `Order confirmation email has been sent to ${templateData.customer?.customerEmail || order.customerEmail}.`
      );
    } else if (!order) {
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        `Unable to get order details with order ID ${orderId}`
      );
    } else {
      throw new CustomError(
        HTTP_STATUS_BAD_REQUEST,
        `Unable to get customer details with customer ID ${order.customerId}`
      );
    }
  }
}
export default OrderConfirmationHandler;
