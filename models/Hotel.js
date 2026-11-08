const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    mapUrl: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [String],
    facilities: [
      {
        name: {
          type: String,
          required: true,
          enum: ["Gym", "Restaurants", "Pool", "View", "Kids Area"],
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    roomPrices: {
      Single: { type: Number, required: true, min: 0 },
      Twin: { type: Number, required: true, min: 0 },
      Family: { type: Number, required: true, min: 0 },
      Suite: { type: Number, required: true, min: 0 },
    },
    roomCapacity: {
      Single: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isInteger,
      },
      Twin: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isInteger,
      },
      Family: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isInteger,
      },
      Suite: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isInteger,
      },
    },
    mealPrices: {
      Breakfast: {
        adult: { type: Number, required: true, min: 0 },
        child: { type: Number, required: true, min: 0 },
      },
      "Half Board": {
        adult: { type: Number, required: true, min: 0 },
        child: { type: Number, required: true, min: 0 },
      },
      "Full Board": {
        adult: { type: Number, required: true, min: 0 },
        child: { type: Number, required: true, min: 0 },
      },
    },
    favoriteByUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
