jest.mock('../../src/utils/config.utils.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    clientId: 'dummy-ctp-client-id',
    clientSecret: 'dummy-ctp-client-secret',
    projectKey: 'dummy-ctp-project-key',
    scope: 'dummy-ctp-scope',
    region: 'dummy-ctp-region',
  })),
}));

import { expect, describe, it, afterEach, jest } from '@jest/globals';
import sinon from 'sinon';
import { messageHandler } from '../../src/controllers/mail-sending.controller.js';
import CustomError from '../../src/errors/custom.error.js';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../../src/constants/http-status.constants.js';

describe('mail-sending.controller.spec', () => {
  afterEach(() => {
    sinon.restore();
  });

  it.each([
    {
      status: HTTP_STATUS_BAD_REQUEST,
      message:
        'Bad request: Wrong No Pub/Sub message format - Missing data in body message',
      request: {
        method: 'POST',
        url: '/',
        body: {
          message: {},
        },
      },
    },
    {
      status: HTTP_STATUS_SUCCESS_ACCEPTED,
      message:
        'Incoming message is about subscription resource creation. Skip handling the message.',
      request: {
        method: 'POST',
        url: '/',
        body: {
          message: {
            data: 'eyJub3RpZmljYXRpb25UeXBlIjoiUmVzb3VyY2VDcmVhdGVkIn0=',
          },
        },
      },
    },
  ])(
    'Should have a custom error with status: $status and message: $message',
    async ({ status, message, request }) => {
      const next = sinon.spy();

      await messageHandler(request, {}, next);
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toBeInstanceOf(CustomError);
      expect(next.firstCall.args[0].statusCode).toBe(status);
      expect(next.firstCall.args[0].message.trim()).toBe(message);
    }
  );
});
