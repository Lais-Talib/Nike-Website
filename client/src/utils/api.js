import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const verifyEmail = (token) => api.post('/auth/verify-email', { token });
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const getProfile = (token) => api.get('/auth/profile', {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateCart = (cart, token) => api.put('/auth/cart', { cart }, {
  headers: { Authorization: `Bearer ${token}` }
});

// Orders
export const createOrder = (orderData, token) => api.post('/orders', orderData, {
  headers: { Authorization: `Bearer ${token}` }
});
export const getMyOrders = (token) => api.get('/orders/myorders', {
  headers: { Authorization: `Bearer ${token}` }
});
export const getOrderDetails = (id, token) => api.get(`/orders/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// AI
export const aiChat = (message, chatHistory) => api.post('/ai/chat', { message, chatHistory });

// Admin Products
export const createProduct = (productData, token) => api.post('/products', productData, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateProduct = (id, productData, token) => api.put(`/products/${id}`, productData, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteProduct = (id, token) => api.delete(`/products/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Admin Orders
export const getAllOrders = (token) => api.get('/orders', {
  headers: { Authorization: `Bearer ${token}` }
});
export const deliverOrder = (id, token) => api.put(`/orders/${id}/deliver`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});

export default api;
