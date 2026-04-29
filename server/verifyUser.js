const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const verifyUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOne({ email });

    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      console.log(`SUCCESS: ${email} is now Verified!`);
    } else {
      console.log(`ERROR: User with email ${email} not found.`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const emailToVerify = process.argv[2] || 'admin@gmail.com';

verifyUser(emailToVerify);
