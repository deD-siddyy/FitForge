const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema(
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
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [10, 'Weight must be at least 10 kg'],
      max: [500, 'Weight cannot exceed 500 kg'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Weight', weightSchema);
