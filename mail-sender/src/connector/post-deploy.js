import { createApiRoot } from '../client/create.client.js';
import { assertError } from '../utils/assert.utils.js';
import { createSubscription } from './actions.js';
import readConfiguration from '../utils/config.utils.js';

async function postDeploy() {
  const config = readConfiguration();
  const apiRoot = createApiRoot();
  await createSubscription(apiRoot, config);
}

async function run() {
  try {
    await postDeploy();
  } catch (error) {
    assertError(error);
    process.stderr.write(`Post-deploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();
