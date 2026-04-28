import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
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

export default api;
