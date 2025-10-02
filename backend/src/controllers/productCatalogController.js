const { ProductCatalog } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

class ProductCatalogController {
  async getProducts(req, res) {
    try {
      const { page = 1, limit = 50, search } = req.query;
      const offset = (page - 1) * limit;

      const where = { userId: req.user.id };
      if (search) {
        where.productName = { [require('sequelize').Op.iLike]: `%${search}%` };
      }

      const products = await ProductCatalog.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['productName', 'ASC']]
      });

      res.json({
        products: products.rows,
        total: products.count,
        page: parseInt(page),
        totalPages: Math.ceil(products.count / limit)
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to get products' });
    }
  }

  async uploadCatalog(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();

      let products = [];

      if (fileExt === '.csv') {
        products = await this.parseCsv(filePath);
      } else if (fileExt === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        products = JSON.parse(fileContent);
        
        if (!Array.isArray(products)) {
          throw new Error('JSON file must contain an array of products');
        }
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: 'Invalid file format. Use CSV or JSON' });
      }

      const createdProducts = [];

      for (const product of products) {
        if (!product.productName) continue;

        const productData = {
          userId: req.user.id,
          productName: product.productName || product.name,
          productSku: product.productSku || product.sku,
          description: product.description,
          price: product.price,
          category: product.category,
          availability: product.availability !== false,
          metadata: product.metadata || {}
        };

        const created = await ProductCatalog.create(productData);
        createdProducts.push(created);
      }

      fs.unlinkSync(filePath);

      res.status(201).json({
        message: 'Products uploaded successfully',
        count: createdProducts.length
      });
    } catch (error) {
      console.error('Upload catalog error:', error);
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to upload catalog' });
    }
  }

  async parseCsv(filePath) {
    return new Promise((resolve, reject) => {
      const products = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          products.push(row);
        })
        .on('end', () => {
          resolve(products);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async createProduct(req, res) {
    try {
      const { productName, productSku, description, price, category, availability } = req.body;

      const product = await ProductCatalog.create({
        userId: req.user.id,
        productName,
        productSku,
        description,
        price,
        category,
        availability
      });

      res.status(201).json({ product });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { productName, productSku, description, price, category, availability } = req.body;

      const product = await ProductCatalog.findOne({
        where: { id, userId: req.user.id }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.update({
        productName,
        productSku,
        description,
        price,
        category,
        availability
      });

      res.json({ product });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await ProductCatalog.findOne({
        where: { id, userId: req.user.id }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  async deleteAllProducts(req, res) {
    try {
      await ProductCatalog.destroy({
        where: { userId: req.user.id }
      });

      res.json({ message: 'All products deleted successfully' });
    } catch (error) {
      console.error('Delete all products error:', error);
      res.status(500).json({ error: 'Failed to delete products' });
    }
  }
}

module.exports = new ProductCatalogController();
