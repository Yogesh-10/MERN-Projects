const express = require('express');
const {
  sendEmailMsg,
} = require('../../controllers/emailMsg/emailMsgController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const emailMsgRoutes = express.Router();

emailMsgRoutes.post('/', authMiddleware, sendEmailMsg);

module.exports = emailMsgRoutes;
