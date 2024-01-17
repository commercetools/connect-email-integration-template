import { Router } from 'express';

import { messageHandler } from '../controllers/mail-sending.controller.js';
const eventRouter = Router();

eventRouter.post(
  '/mailSender',

  messageHandler
);

export default eventRouter;
