import { expect, describe, afterAll, it } from '@jest/globals';
import request from 'supertest';
import server from '../../src/index.js';
import { encodeJsonObject } from './utils/encoder.utils.js';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../../src/constants/http-status.constants.js';

/** Reminder : Please put mandatory environment variables in the settings of your github repository **/
describe('mail-sending.controller.spec', () => {
  it(`When resource identifier is absent in URL, it should returns 404 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.

    response = await request(server).post(`/`);
    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(404);
  });

  it(`When payload body does not exist, it should returns 202 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.
    let payload = {};
    response = await request(server).post(`/mailSender`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
  });

  it(`When payload body exists without correct order ID, it should returns 202 http status`, async () => {
    let response = {};
    // Send request to the connector application with following code snippet.
    // Following incoming message data is an example. Please define incoming message based on resources identifer in your own Commercetools project
    const incomingMessageData = {
      notificationType: 'Message',
      resource: { typeId: 'order', id: 'dummy-product-id' },
      type: 'OrderCreated',
      resourceUserProvidedIdentifiers: { orderNumber: 'dummy-order-number' },
      version: 11,
      oldVersion: 10,
      modifiedAt: '2023-09-12T00:00:00.000Z',
    };

    const encodedMessageData = encodeJsonObject(incomingMessageData);
    let payload = {
      message: {
        data: encodedMessageData,
      },
    };
    response = await request(server).post(`/mailSender`).send(payload);

    expect(response).toBeDefined();
    expect(response.statusCode).toEqual(HTTP_STATUS_SUCCESS_ACCEPTED);
  });

  afterAll(() => {
    // Enable the function below to close the application on server once all test cases are executed.

    if (server) {
      server.close();
    }
  });
});
