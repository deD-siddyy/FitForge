const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    amountMl: {
      type: Number,
      required: [true, 'Amount in ml is required'],
      min: [1, 'Amount must be at least 1 ml'],
      max: [5000, 'Amount cannot exceed 5000 ml per entry'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Water', waterSchema);
