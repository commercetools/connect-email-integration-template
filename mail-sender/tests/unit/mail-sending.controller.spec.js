import { expect, describe, it, beforeEach, jest } from '@jest/globals';
import { messageHandler } from '../../src/controllers/mail-sending.controller.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../../src/constants/http-status.constants.js';
import HandlerFactory from '../../src/factory/handler.factory.js';
import {
  CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES,
  ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
  ORDER_RETURN_INFO_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
  NOTIFICATION_TYPE_RESOURCE_CREATED,
} from '../../src/constants/constants.js';

jest.mock('../../src/factory/handler.factory.js');

describe('mail-sending.controller.spec', () => {
  let mockRequest;
  let mockResponse;
  let responseStatusSpy;
  let mockHandler;

  beforeEach(() => {
    mockRequest = {
      method: 'POST',
      url: '/',
      body: {
        message: {
          data: Buffer.from(JSON.stringify({})).toString('base64'),
        },
      },
    };
    mockResponse = {
      status: () => ({
        send: () => {},
      }),
    };
    responseStatusSpy = jest.spyOn(mockResponse, 'status');
    mockHandler = {
      process: jest.fn().mockResolvedValue(),
    };
    HandlerFactory.mockImplementation(() => ({
      getHandler: () => mockHandler,
    }));
  });

  it('should return 202 HTTP status when message data is missing in incoming event message', async () => {
    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
  });

  it('should handle customer subscription message', async () => {
    const messageData = {
      type: CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES[0],
      resource: {
        typeId: 'customer',
        id: 'customer-123',
      },
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).toHaveBeenCalledWith(messageData);
  });

  it('should handle order confirmation message', async () => {
    const messageData = {
      type: ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
      resource: {
        typeId: 'order',
        id: 'order-123',
      },
      order: {
        customerId: 'customer-123',
      },
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).toHaveBeenCalledWith(messageData);
  });

  it('should handle order state change message', async () => {
    const messageData = {
      type: ORDER_STATE_CHANGE_SUBSCRIPTION_MESSAGE_TYPE,
      resource: {
        typeId: 'order',
        id: 'order-123',
      },
      order: {
        customerId: 'customer-123',
      },
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).toHaveBeenCalledWith(messageData);
  });

  it('should handle order refund message', async () => {
    const messageData = {
      type: ORDER_RETURN_INFO_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
      resource: {
        typeId: 'order',
        id: 'order-123',
      },
      order: {
        customerId: 'customer-123',
      },
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).toHaveBeenCalledWith(messageData);
  });

  it('should skip resource creation notification', async () => {
    const messageData = {
      notificationType: NOTIFICATION_TYPE_RESOURCE_CREATED,
      type: CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES[0],
      resource: {
        typeId: 'customer',
        id: 'customer-123',
      },
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).not.toHaveBeenCalled();
  });

  it('should skip order without customer contact', async () => {
    const messageData = {
      type: ORDER_CREATION_SUBSCRIPTION_MESSAGE_TYPE,
      resource: {
        typeId: 'order',
        id: 'order-123',
      },
      order: {},
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).not.toHaveBeenCalled();
  });

  it('should skip self-created changes', async () => {
    const messageData = {
      type: CUSTOMER_SUBSCRIPTION_MESSAGE_TYPES[0],
      resource: {
        typeId: 'customer',
        id: 'customer-123',
      },
      createdBy: {
        clientId: process.env.CTP_CLIENT_ID,
      },
    };
    mockRequest.body.message.data = Buffer.from(JSON.stringify(messageData)).toString('base64');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy).toHaveBeenCalledWith(HTTP_STATUS_SUCCESS_ACCEPTED);
    expect(mockHandler.process).not.toHaveBeenCalled();
  });
});
