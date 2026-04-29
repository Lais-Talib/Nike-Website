const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      // Validate and convert product IDs if they are numeric
      const Product = require('../models/Product');
      const preparedOrderItems = await Promise.all(orderItems.map(async (item) => {
        let productId = item.product;
        
        // If the ID is a simple number (like "5"), look up the real MongoDB _id
        if (!isNaN(productId) || (typeof productId === 'string' && productId.length < 12)) {
          const product = await Product.findOne({ id: productId });
          if (product) {
            productId = product._id;
          }
        }
        
        return {
          ...item,
          product: productId
        };
      }));

      const order = new Order({
        orderItems: preparedOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        totalPrice
      });

      const createdOrder = await order.save();

      // Send Order Confirmation Email
      try {
        if (req.user && req.user.email) {
          const orderSummary = (orderItems || []).map(item => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
              <span>${item.name || 'Item'} (x${item.quantity || 1})</span>
              <span>$${(item.price || 0) * (item.quantity || 1)}</span>
            </div>
          `).join('');

          await sendEmail({
            email: req.user.email,
            subject: `Order Confirmation - #${createdOrder._id}`,
            message: `Thank you for your order, ${req.user.name}! Your order ID is ${createdOrder._id}. Total: $${totalPrice}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" style="height: 30px; margin-bottom: 20px;">
                <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Order Confirmed</h1>
                <p>Thanks for your order, <strong>${req.user.name}</strong>!</p>
                <p>We've received your order and are getting it ready for shipment. You'll receive another email once your items are on their way.</p>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h2 style="margin-top: 0; font-size: 16px; text-transform: uppercase;">Order Summary</h2>
                  <p style="font-size: 12px; color: #666;">Order ID: ${createdOrder._id}</p>
                  ${orderSummary}
                  <div style="display: flex; justify-content: space-between; padding: 15px 0; font-weight: bold; font-size: 18px;">
                    <span>Total</span>
                    <span>$${totalPrice}</span>
                  </div>
                </div>

                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 14px; text-transform: uppercase;">Shipping Address</h3>
                  <p style="font-size: 14px; color: #444;">
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                    ${shippingAddress.country || 'USA'}
                  </p>
                </div>

                <p style="color: #666; font-size: 12px;">If you have any questions, reply to this email or contact support.</p>
              </div>
            `
          });
        }
      } catch (emailError) {
        console.error('Order confirmation email failed to send:', emailError);
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Order creation error details:', error);
    res.status(500).json({ 
      message: 'Server Error creating order', 
      error: error.message,
      details: error.errors // Include validation errors if any
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered
};
