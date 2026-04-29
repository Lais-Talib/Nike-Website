import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + tax;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-100 dark:border-gray-900 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight dark:text-white flex items-center">
            Bag
            <span className="ml-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-full">
              <ShoppingBag size={24} className="text-black dark:text-white" />
            </span>
          </h1>
        </div>

        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3">
              <div className="flex flex-col">
                {cart.map((item) => (
                  <div 
                    key={`${item.id}-${item.size}`} 
                    className="flex gap-6 py-8 border-b border-gray-100 dark:border-gray-900"
                  >
                    {/* Item Image */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden relative">
                      <Link to={`/product/${item.id}`}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.id}`} className="text-xl font-bold dark:text-white hover:underline underline-offset-2">
                            {item.name}
                          </Link>
                          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {item.category} {item.subcategory} Shoe
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Color: <span className="text-gray-900 dark:text-gray-300">{item.color}</span>
                          </p>
                          {item.size && (
                            <p className="text-gray-500 dark:text-gray-400">
                              Size: <span className="text-gray-900 dark:text-gray-300 font-bold">{item.size}</span>
                            </p>
                          )}
                        </div>
                        <p className="text-xl font-black dark:text-white">${item.price}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="p-2 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors dark:text-white active:scale-95"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold w-6 text-center dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="p-2 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors dark:text-white active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={clearCart}
                  className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white font-bold underline underline-offset-4 text-sm transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] p-8 sticky top-28">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8 dark:text-white">Summary</h2>
                
                <div className="space-y-4 text-lg mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-bold dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Tax</span>
                    <span className="font-bold dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Delivery</span>
                    <span className="font-bold text-green-600 dark:text-green-500">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold dark:text-white">Total</span>
                  <span className="text-3xl font-black dark:text-white">${total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-black text-lg uppercase tracking-tight hover:opacity-90 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3 shadow-xl">
                  <span>Checkout</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-gray-50 dark:bg-[#111111] rounded-[3rem]"
          >
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-full shadow-sm">
                <ShoppingBag size={48} className="text-gray-300 dark:text-gray-700" />
              </div>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight dark:text-white mb-4">There are no items in your bag.</h2>
            <Link 
              to="/category/all" 
              className="mt-6 inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Start Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
