import api from './api';

export interface Product {
  id: string;
  productName: string;
  productSku?: string;
  description?: string;
  price?: number;
  category?: string;
  availability: boolean;
}

export const productService = {
  getProducts: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  uploadCatalog: async (file: File) => {
    const formData = new FormData();
    formData.append('catalog', file);
    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createProduct: async (data: Partial<Product>) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  deleteAllProducts: async () => {
    const response = await api.delete('/products');
    return response.data;
  }
};
