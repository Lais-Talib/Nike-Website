const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    if (user) {
      // Send Verification Email
      const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;
      
      const message = `Welcome to Nike Store, ${name}! Please verify your email by clicking the link: \n\n ${verificationUrl}`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Email Verification - Nike Store',
          message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" style="height: 30px; margin-bottom: 20px;">
              <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Verify Your Email</h1>
              <p>Welcome to the Nike Store! Please click the button below to verify your email address and activate your account.</p>
              <a href="${verificationUrl}" style="display: inline-block; padding: 15px 30px; background-color: #000; color: #fff; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0;">Verify Email</a>
              <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
            </div>
          `
        });

        res.status(201).json({
          message: 'Registration successful! Please check your email to verify your account.'
        });
      } catch (error) {
        console.error('Email send error:', error);
        res.status(201).json({
          message: 'User registered, but verification email could not be sent. Please contact support.'
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ 
          message: 'Please verify your email before logging in.',
          isNotVerified: true 
        });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // In a real app, you would generate a token and save it to the DB
    // For this demo, we'll simulate the successful sending of a reset email
    // IF the user provides SMTP credentials in .env, this will actually work!
    
    const resetUrl = `http://localhost:3000/reset-password/dummy-token`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" style="height: 30px; margin-bottom: 20px;">
            <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Reset your password</h1>
            <p>You requested a password reset. Click the button below to choose a new password.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background-color: #000; color: #fff; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
      console.error('Email send error:', error);
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user cart
// @route   PUT /api/auth/cart
// @access  Private
const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.cart = req.body.cart;
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // In a real app, you would verify the token from the DB
    // For this demo, we'll allow any non-empty password update for the dummy flow
    // In a real production app, we would look up user by resetToken
    
    // Simulating user lookup by email (for demo purposes)
    // You would normally use User.findOne({ resetPasswordToken: token })
    const user = await User.findOne({ email: "a.md.laistalib@gmail.com" }); // Target user for demo

    if (user) {
      user.password = password;
      await user.save();
      res.json({ message: 'Password reset successful' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully! You can now log in.',
      token: generateToken(user._id), // Automatically log them in after verification
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  updateCart,
  resetPassword,
  verifyEmail
};
