import { expect, describe, it, afterEach } from '@jest/globals';

import sinon from 'sinon';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../../src/constants/http-status.constants.js';
// import readConfiguration from '../../src/utils/config.utils.js';
import * as configUtils from '../../src/utils/config.utils.js'; // Import as a namespace

describe('mail-sending.controller.spec', () => {
  afterEach(() => {
    sinon.restore();
  });

  it(`should return 202 HTTP status when message data is missing in incoming event message.`, async () => {

    const dummyConfig = {
      
        clientId: 'dummy-ctp-client-id',
        clientSecret: 'dummy-ctp-client-secret',
        projectKey: 'dummy-ctp-project-key',
        scope: 'dummy-ctp-scope',
        region: 'dummy-ctp-region'
    };

    sinon.stub(configUtils, 'default').returns(dummyConfig);
    const { messageHandler } = await import('../../src/controllers/mail-sending.controller.js');
    
    const mockRequest = {
      method: 'POST',
      url: '/',
      body: {
        message: {},
      },
    };
    const mockResponse = {
      status: () => {
        return {
          send: () => {},
        };
      },
    };
    const responseStatusSpy = sinon.spy(mockResponse, 'status');

    await messageHandler(mockRequest, mockResponse);
    expect(responseStatusSpy.firstCall.firstArg).toEqual(
      HTTP_STATUS_SUCCESS_ACCEPTED
    );
  });
});
