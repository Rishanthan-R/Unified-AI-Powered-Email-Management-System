const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productCatalogController = require('../controllers/productCatalogController');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'));
    }
  }
});

router.get('/', authMiddleware, productCatalogController.getProducts);
router.post('/upload', authMiddleware, upload.single('catalog'), productCatalogController.uploadCatalog);
router.post('/', authMiddleware, productCatalogController.createProduct);
router.put('/:id', authMiddleware, productCatalogController.updateProduct);
router.delete('/:id', authMiddleware, productCatalogController.deleteProduct);
router.delete('/', authMiddleware, productCatalogController.deleteAllProducts);

module.exports = router;
