import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 15;
  const taxPrice = Number((0.08 * subtotal).toFixed(2));
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          size: item.size,
          product: item._id || item.id // Use DB id if available
        })),
        shippingAddress,
        paymentMethod,
        totalPrice
      };

      const { data } = await createOrder(orderData, user.token);
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-gray-500 hover:text-black dark:hover:text-white mb-8 font-bold transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 dark:text-white">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Forms */}
          <div className="flex-grow space-y-12">
            {/* Shipping Section */}
            <section>
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-2xl">
                  <Truck size={24} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Shipping Information</h2>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">City</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Postal Code</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-black dark:focus:border-white outline-none transition-all dark:text-white font-bold"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  />
                </div>
              </form>
            </section>

            {/* Payment Section */}
            <section>
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                    paymentMethod === 'Credit Card' 
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xl scale-[1.02]' 
                      : 'border-gray-100 dark:border-gray-900 dark:text-white hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="mb-4" />
                  <span className="font-black uppercase tracking-tight">Credit or Debit Card</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('PayPal')}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                    paymentMethod === 'PayPal' 
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xl scale-[1.02]' 
                      : 'border-gray-100 dark:border-gray-900 dark:text-white hover:border-gray-300'
                  }`}
                >
                  <div className="mb-4 text-xl font-black italic">PayPal</div>
                  <span className="font-black uppercase tracking-tight">PayPal Checkout</span>
                </button>
              </div>
            </section>

            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2.5rem] flex items-center space-x-4 border border-gray-100 dark:border-gray-800">
              <ShieldCheck className="text-green-500" size={32} />
              <div>
                <h4 className="font-black uppercase tracking-tight dark:text-white">Secure Checkout</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your data is encrypted and secure.</p>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-8 sticky top-28 border border-gray-100 dark:border-gray-800 shadow-xl">
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 dark:text-white">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-white dark:bg-black rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold dark:text-white line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="text-sm font-black dark:text-white mt-1">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                  <span>Estimated Shipping</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                  <span>Estimated Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black dark:text-white pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isLoading || !shippingAddress.address}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-tight hover:opacity-90 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 shadow-2xl"
              >
                <span>{isLoading ? 'Processing...' : 'Place Order'}</span>
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
