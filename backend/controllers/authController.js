const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
      console.log("🔥 REGISTER CONTROLLER HIT");
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : email;


    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password)' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};


const loginUser = async (req, res, next) => {
  console.log("🔥 LOGIN CONTROLLER HIT");
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }


    const normalizedEmail = email.toLowerCase().trim();


    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};


const getProfile = async (req, res, next) => {
  try {
    
    if (req.user) {
      res.status(200).json({
        success: true,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
