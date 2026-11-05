const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Twin", "Family", "Suite"],
    },
    bedType: {
      type: String,
      required: true,
      enum: ["King", "Queen", "Twin"],
    },
    viewType: {
      type: String,
      required: true,
      enum: ["Sea", "City", "Garden"],
    },
    adults: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      validate: Number.isInteger,
    },
    children: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
      validate: Number.isInteger,
    },
    rooms: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
      validate: Number.isInteger,
    },
    mealPlan: {
      type: String,
      required: true,
      enum: ["Breakfast", "Half Board", "Full Board"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
