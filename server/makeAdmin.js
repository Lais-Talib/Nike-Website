const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      user.isVerified = true;
      await user.save();
      console.log(`SUCCESS: ${email} is now an Admin!`);
    } else {
      console.log(`ERROR: User with email ${email} not found.`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Replace 'your-email@example.com' with the email you signed up with
const emailToMakeAdmin = process.argv[2] || 'your-email@example.com';

if (emailToMakeAdmin === 'your-email@example.com') {
  console.log('Please provide an email as an argument: node makeAdmin.js your@email.com');
  process.exit(1);
}

makeAdmin(emailToMakeAdmin);
