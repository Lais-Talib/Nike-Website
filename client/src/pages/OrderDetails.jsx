import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderDetails } from '../utils/api';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Calendar, MapPin } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderDetails(id, user.token);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrder();
  }, [id, user]);

  if (loading) return (
    <div className="pt-32 pb-20 min-h-screen text-center flex items-center justify-center flex-col bg-white dark:bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Loading order details...</p>
    </div>
  );

  if (!order) return (
    <div className="pt-32 pb-20 min-h-screen text-center flex items-center justify-center flex-col bg-white dark:bg-[#0a0a0a]">
      <h2 className="text-2xl font-black uppercase dark:text-white">Order not found</h2>
      <Link to="/" className="mt-4 text-gray-500 underline">Back to Shopping</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-950/20 rounded-[3rem] p-10 text-center mb-12 border border-green-100 dark:border-green-900/30"
        >
          <div className="inline-flex items-center justify-center bg-green-500 text-white p-4 rounded-full mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-green-900 dark:text-green-400 mb-2">Order Confirmed</h1>
          <p className="text-green-700 dark:text-green-500/80 font-bold">Thank you for your purchase! Your order is being prepared.</p>
          <p className="text-sm text-green-600/60 mt-4 uppercase tracking-widest font-black">Order ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4 text-gray-400">
              <Calendar size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Order Date</span>
            </div>
            <p className="font-bold dark:text-white">{new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4 text-gray-400">
              <Truck size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Shipping</span>
            </div>
            <p className="font-bold dark:text-white">Standard Delivery (3-5 days)</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4 text-gray-400">
              <MapPin size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Address</span>
            </div>
            <p className="font-bold dark:text-white leading-tight">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-gray-900 overflow-hidden shadow-xl">
          <div className="p-8 border-b border-gray-100 dark:border-gray-900">
            <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Order Summary</h2>
          </div>
          <div className="p-8 space-y-8">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex gap-6 items-center">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black uppercase tracking-tight dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{item.category} • Size: {item.size}</p>
                  <p className="text-sm text-gray-400 mt-1 font-medium">Quantity: {item.quantity}</p>
                </div>
                <div className="text-xl font-black dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
            <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">Total Amount Paid</div>
            <div className="text-3xl font-black dark:text-white">${order.totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-12 flex justify-center space-x-6">
          <Link 
            to="/category/all" 
            className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black uppercase tracking-tight hover:opacity-80 transition-all"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/my-orders" 
            className="border-2 border-gray-200 dark:border-gray-800 dark:text-white px-10 py-4 rounded-full font-black uppercase tracking-tight hover:border-black dark:hover:border-white transition-all"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
