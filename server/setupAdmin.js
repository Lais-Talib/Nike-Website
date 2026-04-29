const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const createAdminAccount = async () => {
  const email = 'admin@gmail.com';
  const password = 'admin123';
  const name = 'Admin User';

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists. Updating to Admin status and resetting password...');
      const salt = await bcrypt.genSalt(10);
      userExists.password = await bcrypt.hash(password, salt);
      userExists.isAdmin = true;
      await userExists.save();
      console.log('SUCCESS: admin@gmail.com has been updated and is an Admin!');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: true
      });

      console.log('SUCCESS: New Admin account created!');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin123');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdminAccount();
