const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, emailController.getEmails);
router.get('/:id', authMiddleware, emailController.getEmailById);
router.post('/sync', authMiddleware, emailController.syncEmails);
router.patch('/:id/read', authMiddleware, emailController.markAsRead);
router.post('/:id/auto-reply', authMiddleware, emailController.generateAutoReply);

module.exports = router;
