import GenericHandler from '../handlers/generic.handler.js';
import { logger } from '../utils/logger.utils.js';
import { getOrderById, getCustomerById } from '../client/query.client.js';
import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_BAD_REQUEST } from '../constants/http-status.constants.js';
import { convertMoneyToText } from '../utils/money.utils.js';
import { addImageSizeSuffix } from '../utils/image.utils.js';
import { IMAGE_SIZE_SMALL } from '../constants/image.constants.js';

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_CUSTOMER_NAME = 'Customer';
class OrderConfirmationHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    logger.info(JSON.stringify(messageBody));
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.ORDER_CONFIRMATION_TEMPLATE_ID;

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
          productSku: lineItem.variant.sku,
          productImage: lineItem.variant.images[0]
            ? addImageSizeSuffix(
                lineItem.variant.images[0].url,
                IMAGE_SIZE_SMALL
              )
            : '',
          productSubTotal: convertMoneyToText(lineItem.totalPrice),
        };
        orderLineItems.push(item);
      }
      const orderDetails = {
        orderNumber: order.orderNumber ? order.orderNumber : '',
        customerEmail: order.customerEmail
          ? order.customerEmail
          : customer.email,
        customerFirstName: customer?.firstName
          ? customer.firstName
          : DEFAULT_CUSTOMER_NAME,
        customerMiddleName: customer?.middleName ? customer.middleName : '',
        customerLastName: customer?.lastName ? customer.lastName : '',
        orderCreationTime: order.createdAt,
        orderTotalPrice: convertMoneyToText(order.totalPrice),
        orderTaxedPrice: order.taxedPrice
          ? convertMoneyToText(order.taxedPrice)
          : '',
        orderLineItems,
      };

      logger.info(
        `Ready to send order confirmation email of customer registration : customerEmail=${orderDetails.customerEmail}, orderNumber=${orderDetails.orderNumber}, customerMiddleName=${orderDetails.customerMiddleName}, customerCreationTime=${orderDetails.orderCreationTime}`
      );
      await super.sendMail(
        senderEmailAddress,
        orderDetails.customerEmail,
        templateId,
        orderDetails
      );
      logger.info(
        `Confirmation email of customer registration has been sent to ${orderDetails.customerEmail}.`
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
