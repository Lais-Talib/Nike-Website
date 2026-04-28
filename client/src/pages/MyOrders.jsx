import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../utils/api';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders(user.token);
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (loading) return (
    <div className="pt-32 pb-20 min-h-screen text-center flex items-center justify-center flex-col bg-white dark:bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Loading your orders...</p>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 dark:border-gray-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight dark:text-white">My Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage and track your recent purchases.</p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-sm font-black uppercase tracking-widest text-gray-400">Total Orders</span>
            <p className="text-2xl font-black dark:text-white">{orders.length}</p>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white dark:bg-[#111111] rounded-[2rem] border border-gray-100 dark:border-gray-900 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-8">
                  {/* Order Main Info */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-black uppercase tracking-widest dark:text-white">
                        ID: #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle size={12} />
                        Confirmed
                      </span>
                    </div>
                    <h3 className="text-xl font-black dark:text-white mb-2">
                      {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'} Purchased
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="font-bold text-black dark:text-white">
                        Total: ${order.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex -space-x-4">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-xl border-4 border-white dark:border-[#111111] bg-gray-50 dark:bg-gray-800 overflow-hidden shadow-md">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-16 h-16 rounded-xl border-4 border-white dark:border-[#111111] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-black dark:text-white shadow-md">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Link 
                    to={`/order/${order._id}`}
                    className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black uppercase tracking-tight flex items-center justify-center space-x-2 hover:scale-[1.02] transition-all group-hover:shadow-lg"
                  >
                    <span>View Details</span>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 dark:bg-[#111111] rounded-[3rem]">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-full shadow-sm">
                <Package size={48} className="text-gray-300 dark:text-gray-700" />
              </div>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight dark:text-white mb-4">You haven't placed any orders yet.</h2>
            <Link 
              to="/category/all" 
              className="mt-6 inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
