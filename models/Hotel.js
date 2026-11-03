const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    facilities: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
