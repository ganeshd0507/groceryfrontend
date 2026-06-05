import apiClient from '../api/client';

export const apiService = {
  // Product Endpoints
  async getProducts() {
    const response = await apiClient.get('/products');
    return response.data;
  },

  async getProductById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async addProduct(productData) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Category Endpoints
  async getCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Order Endpoints
  async getOrders() {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  async placeOrder(orderData) {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await apiClient.put(`/orders/${id}`, { status });
    return response.data;
  },

  // Authentication Endpoints
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }
};
