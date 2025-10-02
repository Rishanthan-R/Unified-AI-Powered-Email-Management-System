const express = require('express');
const router = express.Router();
const emailAccountController = require('../controllers/emailAccountController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, emailAccountController.getAccounts);

router.get('/gmail/auth', authMiddleware, emailAccountController.initiateGmailAuth);
router.get('/gmail/callback', emailAccountController.handleGmailCallback);

router.get('/outlook/auth', authMiddleware, emailAccountController.initiateOutlookAuth);
router.get('/outlook/callback', emailAccountController.handleOutlookCallback);

router.post('/imap', authMiddleware, emailAccountController.addImapAccount);

router.delete('/:id', authMiddleware, emailAccountController.deleteAccount);

module.exports = router;
