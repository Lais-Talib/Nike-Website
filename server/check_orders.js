const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');

dotenv.config();

const checkOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders.`);
    if (orders.length > 0) {
      console.log('Last order:', JSON.stringify(orders[orders.length - 1], null, 2));
    }
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkOrders();
