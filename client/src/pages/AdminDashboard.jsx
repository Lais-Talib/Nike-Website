import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getProducts, 
  getAllOrders, 
  deleteProduct, 
  createProduct, 
  updateProduct,
  deliverOrder 
} from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Men',
    subcategory: 'Shoes',
    color: ''
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        getProducts(),
        getAllOrders(user.token)
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id, user.token);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        color: product.color
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: `nike-${Math.floor(Math.random() * 10000)}`,
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Men',
        subcategory: 'Shoes',
        color: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData, user.token);
      } else {
        await createProduct(formData, user.token);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const handleDeliver = async (id) => {
    try {
      await deliverOrder(id, user.token);
      fetchData();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  if (isLoading) return (
    <div className="pt-32 flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your store operations</p>
          </div>
          
          <div className="flex bg-white dark:bg-gray-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'orders', icon: ShoppingBag, label: 'Orders' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black uppercase tracking-tight text-xs transition-all ${
                  activeTab === tab.id 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                    : 'text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <StatsCard title="Total Sales" value={`$${totalSales.toLocaleString()}`} icon={TrendingUp} color="text-green-500" />
              <StatsCard title="Total Orders" value={orders.length} icon={ShoppingBag} color="text-blue-500" />
              <StatsCard title="Total Products" value={products.length} icon={Package} color="text-purple-500" />
              <StatsCard title="Customers" value={new Set(orders.map(o => o.user?.id)).size} icon={Users} color="text-orange-500" />
              
              {/* Recent Orders Table */}
              <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8 dark:text-white">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Total</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id} className="text-sm font-bold dark:text-white">
                          <td className="py-4">#{order._id.slice(-6)}</td>
                          <td className="py-4">{order.user?.name || 'Guest'}</td>
                          <td className="py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4">${order.totalPrice.toFixed(2)}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                              {order.isDelivered ? 'Delivered' : 'Processing'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Products Catalog</h2>
                <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black uppercase tracking-tight text-xs hover:scale-105 transition-all shadow-xl"
                >
                  <Plus size={16} />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-black/20 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <th className="p-6">Product</th>
                        <th className="p-6">Category</th>
                        <th className="p-6">Price</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {products.map(product => (
                        <tr key={product.id} className="text-sm font-bold dark:text-white hover:bg-gray-50 dark:hover:bg-black/10 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center space-x-4">
                              <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                              <div>
                                <p className="font-black leading-none mb-1">{product.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase">{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 uppercase text-xs">{product.category} / {product.subcategory}</td>
                          <td className="p-6">${product.price}</td>
                          <td className="p-6">
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => handleOpenModal(product)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-blue-500 transition-colors">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white mb-8">Manage Orders</h2>
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="font-black dark:text-white">Order #{order._id.slice(-8)}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {order.isDelivered ? 'Delivered' : 'Processing'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-bold uppercase tracking-tight text-gray-500">
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Customer</p>
                            <p className="dark:text-white">{order.user?.name || 'Guest'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Date</p>
                            <p className="dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Total</p>
                            <p className="dark:text-white">${order.totalPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Items</p>
                            <p className="dark:text-white">{order.orderItems.length} products</p>
                          </div>
                        </div>
                      </div>
                      
                      {!order.isDelivered && (
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleDeliver(order._id)}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black uppercase tracking-tight text-xs hover:scale-105 transition-all shadow-xl"
                          >
                            Mark as Delivered
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-black/40 rounded-full dark:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Internal ID</label>
                    <input 
                      type="text" 
                      readOnly={!!editingProduct}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Color</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Subcategory</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      required
                      className="flex-grow px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-300" />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea 
                    rows="3"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-tight hover:opacity-90 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 shadow-2xl"
                  >
                    <Save size={20} />
                    <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
    <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-black/40 w-fit mb-6 ${color}`}>
      <Icon size={24} />
    </div>
    <h4 className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">{title}</h4>
    <p className="text-3xl font-black dark:text-white">{value}</p>
  </div>
);

export default AdminDashboard;
