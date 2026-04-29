const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const testOrdersApi = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!user) {
      console.log('Admin user not found');
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    console.log('Testing GET /api/orders with token...');
    const response = await fetch('http://127.0.0.1:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Orders found:', data.length);
    if (data.length > 0) {
      console.log('First order:', JSON.stringify(data[0], null, 2));
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testOrdersApi();
