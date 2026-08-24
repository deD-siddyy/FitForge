const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * User Controller
 * Handles user profile CRUD operations.
 */

// ─────────────────────────────────────────────
// @desc    Get all users
// @route   GET /api/users
// @access  Private / Admin
// ─────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
// ─────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (own profile only; admin can update any)
// ─────────────────────────────────────────────
const updateUser = async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Authorization: only the owner or an admin can update
    const isOwner = req.user._id.toString() === req.params.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update another user\'s profile',
      });
    }

    // Whitelist allowed update fields — block _id, password hash, role changes by normal users
    const { name, email } = req.body;
    const updates = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      // Check for duplicate email (exclude the current user's own email)
      const emailTaken = await User.findOne({ email: normalizedEmail, _id: { $ne: req.params.id } });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: 'Email already in use by another account' });
      }

      updates.email = normalizedEmail;
    }

    // Only admin can update role
    if (req.body.role !== undefined && isAdmin) {
      updates.role = req.body.role;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private / Admin
// ─────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `User '${user.email}' deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
