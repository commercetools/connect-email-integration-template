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
class OrderRefundHandler extends GenericHandler {
  constructor() {
    super();
  }

  buildOrderDetails(order, customer, returnedLineItems) {
    return {
      orderNumber: order.orderNumber ? order.orderNumber : '',
      customerEmail: order.customerEmail ? order.customerEmail : customer.email,
      customerFirstName: customer?.firstName
        ? customer.firstName
        : DEFAULT_CUSTOMER_NAME,
      customerMiddleName: customer?.middleName ? customer.middleName : '',
      customerLastName: customer?.lastName ? customer.lastName : '',
      orderCreationTime: order.createdAt,
      orderState: order.orderState,
      orderShipmentState: order.shipmentState,
      orderTotalPrice: convertMoneyToText(order.totalPrice),
      orderTaxedPrice: order.taxedPrice
        ? convertMoneyToText(order.taxedPrice)
        : '',
      orderLineItems: returnedLineItems,
    };
  }

  async process(messageBody) {
    logger.info(JSON.stringify(messageBody));
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateId = process.env.ORDER_REFUND_TEMPLATE_ID;

    const orderId = messageBody.resource.id;
    const order = await getOrderById(orderId);
    if (order) {
      let customer;
      if (order.customerId) {
        customer = await getCustomerById(order.customerId);
      }
      const returnedLineItemId = order.returnInfo
        .flatMap((returnInfo) => returnInfo.items)
        .map((item) => item.lineItemId);
      const returnedLineItems = [];

      for (const lineItem of order.lineItems) {
        if (returnedLineItemId.includes(lineItem.id)) {
          // Rule out those line items which are not going to be returned.
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
          returnedLineItems.push(item);
        }
      }
      if (returnedLineItems.length > 0) {
        const orderDetails = this.buildOrderDetails(
          order,
          customer,
          returnedLineItems
        );
        logger.info(
          `Ready to send order state change email : customerEmail=${orderDetails.customerEmail}, orderNumber=${orderDetails.orderNumber}, customerMiddleName=${orderDetails.customerMiddleName}, customerCreationTime=${orderDetails.orderCreationTime}`
        );
        await super.sendMail(
          senderEmailAddress,
          orderDetails.customerEmail,
          templateId,
          orderDetails
        );
        logger.info(
          `Order state change email has been sent to ${orderDetails.customerEmail}.`
        );
      } else {
        throw new CustomError(
          HTTP_STATUS_BAD_REQUEST,
          `No returned line item is found for order ${orderId}`
        );
      }
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
export default OrderRefundHandler;
