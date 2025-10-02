const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const emailAccountRoutes = require('./emailAccountRoutes');
const emailRoutes = require('./emailRoutes');
const productCatalogRoutes = require('./productCatalogRoutes');

router.use('/auth', authRoutes);
router.use('/email-accounts', emailAccountRoutes);
router.use('/emails', emailRoutes);
router.use('/products', productCatalogRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
