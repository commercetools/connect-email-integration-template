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
const DEFAULT_CUSTOMER_NAME = 'Customer';
class OrderStateChangeHandler extends GenericHandler {
  constructor() {
    super();
  }

  async process(messageBody) {
    logger.info(JSON.stringify(messageBody));
    const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
    const templateType = EMAIL_TEMPLATE_TYPES['shipping-confirmation'];

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
      
      // Estructurar los datos de manera más organizada, pero manteniendo toda la data original
      const templateData = {
        // Incluir el objeto order completo para que los usuarios tengan acceso a todas sus propiedades
        order: {
          ...order,
          // Agregar propiedades formateadas para facilitar su uso en templates
          orderNumber: order.orderNumber || '',
          orderId: order.id,
          orderCreationTime: order.createdAt,
          orderTotalPrice: convertMoneyToText(order.totalPrice),
          orderTaxedPrice: order.taxedPrice ? convertMoneyToText(order.taxedPrice) : '',
          orderState: order.orderState,
          orderShipmentState: order.shipmentState,
          orderLineItems: orderLineItems,
        },
        // Incluir el objeto customer completo si existe
        customer: customer ? {
          ...customer,
          // Agregar propiedades formateadas para facilitar su uso en templates
          customerEmail: customer.email,
          customerNumber: customer.customerNumber || '',
          customerFirstName: customer.firstName || '',
          customerMiddleName: customer.middleName || '',
          customerLastName: customer.lastName || '',
        } : null
      };

      logger.info(
        `Ready to send order state change email : orderNumber=${templateData.order.orderNumber}, customerEmail=${templateData.customer?.customerEmail}`
      );
      await super.sendMail(
        senderEmailAddress,
        templateData.customer?.customerEmail || order.customerEmail,
        templateType,
        templateData
      );
      logger.info(
        `Order state change email has been sent to ${templateData.customer?.customerEmail || order.customerEmail}.`
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
export default OrderStateChangeHandler;
