const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const connectToDB = require("./db.js");
const Hotel = require("./models/Hotel.js");

const hotels = [
  {
    name: "Wyndham Grand Manama",
    location: "Road 4609, Building 316, Manama, Bahrain",
    mapUrl: "https://maps.app.goo.gl/c55UAEk6oUBs6oAB6",
    rating: 5,
    image: "/images/Wyndham-Grand-Manama/Wyndham-Grand-Manama.jpg",
    gallery: [
      "/images/Wyndham-Grand-Manama/king-room.jpg",
      "/images/Wyndham-Grand-Manama/twin-room.jpg",
      "/images/Wyndham-Grand-Manama/bathroom.jpg",
      "/images/Wyndham-Grand-Manama/kitchen.jpg",
    ],
    facilities: [
      { name: "Gym", image: "/images/Wyndham-Grand-Manama/gym.jpg" },
      {
        name: "Restaurants",
        image: "/images/Wyndham-Grand-Manama/resturant.jpg",
      },
      { name: "Pool", image: "/images/Wyndham-Grand-Manama/pool.jpg" },
      { name: "View", image: "/images/Wyndham-Grand-Manama/view.jpg" },
      {
        name: "Kids Area",
        image: "/images/Wyndham-Grand-Manama/kids-area.jpg",
      },
    ],
    roomPrices: { Single: 120, Twin: 160, Family: 340, Suite: 500 },
    roomCapacity: { Single: 1, Twin: 2, Family: 4, Suite: 3 },
    mealPrices: {
      Breakfast: { adult: 15, child: 8 },
      "Half Board": { adult: 35, child: 18 },
      "Full Board": { adult: 55, child: 28 },
    },
  },
  {
    name: "Onyx Rotana",
    location: "Building 678, Road 4614, Block 346, Bahrain Bay Manama, Bahrain",
    mapUrl: "https://maps.app.goo.gl/CYWNazwBggfmi9Je8",
    rating: 5,
    image: "/images/Onyx-Rotana/Onyx-Rotana.jpg",
    gallery: [
      "/images/Onyx-Rotana/king-bed.jpg",
      "/images/Onyx-Rotana/kitchen.jpg",
      "/images/Onyx-Rotana/living-room.jpg",
      "/images/Onyx-Rotana/bathroom.jpg",
    ],
    facilities: [
      { name: "Gym", image: "/images/Onyx-Rotana/gym.jpg" },
      { name: "Restaurants", image: "/images/Onyx-Rotana/restruant.jpg" },
      { name: "Pool", image: "/images/Onyx-Rotana/pool.jpg" },
      { name: "View", image: "/images/Onyx-Rotana/view.jpg" },
      { name: "Kids Area", image: "/images/Onyx-Rotana/kids-area.jpg" },
    ],
    roomPrices: { Single: 150, Twin: 290, Family: 480, Suite: 650 },
    roomCapacity: { Single: 2, Twin: 2, Family: 5, Suite: 4 },
    mealPrices: {
      Breakfast: { adult: 18, child: 10 },
      "Half Board": { adult: 40, child: 20 },
      "Full Board": { adult: 60, child: 30 },
    },
  },
  {
    name: "Raffles Al Areen Palace Bahrain",
    location: "Building 2046, Road 6232, Block 1062, Manama, Bahrain",
    mapUrl: "https://maps.app.goo.gl/KqWdn8Z4t95js1uo9",
    rating: 5,
    image:
      "/images/Raffles-Al-Areen-Palace-Bahrain/Raffles-Al-Areen-Palace-Bahrain.jpg",
    gallery: [
      "/images/Raffles-Al-Areen-Palace-Bahrain/king-bed.jpg",
      "/images/Raffles-Al-Areen-Palace-Bahrain/living-room.jpg",
      "/images/Raffles-Al-Areen-Palace-Bahrain/bathroom.jpg",
      "/images/Raffles-Al-Areen-Palace-Bahrain/private-pool.jpg",
    ],
    facilities: [
      { name: "Gym", image: "/images/Raffles-Al-Areen-Palace-Bahrain/gym.jpg" },
      {
        name: "Restaurants",
        image: "/images/Raffles-Al-Areen-Palace-Bahrain/resturant.jpg",
      },
      {
        name: "Pool",
        image: "/images/Raffles-Al-Areen-Palace-Bahrain/pool.jpg",
      },
      {
        name: "View",
        image: "/images/Raffles-Al-Areen-Palace-Bahrain/view.jpg",
      },
      {
        name: "Kids Area",
        image: "/images/Raffles-Al-Areen-Palace-Bahrain/kids-area.jpg",
      },
    ],
    roomPrices: { Single: 130, Twin: 175, Family: 260, Suite: 520 },
    roomCapacity: { Single: 1, Twin: 3, Family: 4, Suite: 2 },
    mealPrices: {
      Breakfast: { adult: 20, child: 12 },
      "Half Board": { adult: 45, child: 25 },
      "Full Board": { adult: 70, child: 35 },
    },
  },
  {
    name: "The Mark Hotel",
    location: "Building 1234, Road 5678, Block 9012, Manama, Bahrain",
    mapUrl: "https://maps.app.goo.gl/aQQ7XbuiQNApwRZ4A",
    rating: 4,
    image: "/images/The-Mark-Hotel/The-Mark-Hotel.jpg",
    gallery: [
      "/images/The-Mark-Hotel/king-bed.jpg",
      "/images/The-Mark-Hotel/bathroom.jpg",
      "/images/The-Mark-Hotel/twin-bed.jpg",
      "/images/The-Mark-Hotel/living-room.jpg",
    ],
    facilities: [
      { name: "Gym", image: "/images/The-Mark-Hotel/gym.jpg" },
      { name: "Restaurants", image: "/images/The-Mark-Hotel/resturant.png" },
      { name: "Pool", image: "/images/The-Mark-Hotel/pool.jpg" },
    ],
    roomPrices: { Single: 90, Twin: 125, Family: 190, Suite: 300 },
    roomCapacity: { Single: 1, Twin: 2, Family: 6, Suite: 4 },
    mealPrices: {
      Breakfast: { adult: 12, child: 6 },
      "Half Board": { adult: 28, child: 14 },
      "Full Board": { adult: 45, child: 22 },
    },
  },
  {
    name: "ibis Seef Manama",
    location: "Building 567, Road 890, Block 123, Manama, Bahrain",
    mapUrl: "https://maps.app.goo.gl/AhM3B5CuEbzyoE8c9",
    rating: 4,
    image: "/images/ibis-Seef-Manama/ibis-Seef-Manama.jpg",
    gallery: [
      "/images/ibis-Seef-Manama/king-bed.jpg",
      "/images/ibis-Seef-Manama/bathroom.jpg",
      "/images/ibis-Seef-Manama/twin-bed.jpg",
      "/images/ibis-Seef-Manama/living-room.jpg",
    ],
    facilities: [
      { name: "Gym", image: "/images/ibis-Seef-Manama/gym.jpg" },
      {
        name: "Restaurants",
        image: "/images/ibis-Seef-Manama/resturant.jpg",
      },
      { name: "View", image: "/images/ibis-Seef-Manama/view.jpg" },
    ],
    roomPrices: { Single: 100, Twin: 140, Family: 210, Suite: 340 },
    roomCapacity: { Single: 2, Twin: 3, Family: 5, Suite: 3 },
    mealPrices: {
      Breakfast: { adult: 14, child: 7 },
      "Half Board": { adult: 30, child: 16 },
      "Full Board": { adult: 50, child: 25 },
    },
  },
  {
    name: "Tropicana Hotel",
    location: "Building 901, Road 234, Block 567, Manama, Bahrain",
    mapUrl: "https://maps.app.goo.gl/aKVzAgjaq5ocQoNd8",
    rating: 3,
    image: "/images/Tropicana-Hotel/Tropicana-Hotel.jpg",
    gallery: [
      "/images/Tropicana-Hotel/king-bed.jpg",
      "/images/Tropicana-Hotel/bathroom.jpg",
      "/images/Tropicana-Hotel/living-room.jpg",
    ],
    facilities: [
      { name: "Gym", image: "/images/Tropicana-Hotel/gym.jpg" },
      { name: "Restaurants", image: "/images/Tropicana-Hotel/resturant.jpg" },
      { name: "Pool", image: "/images/Tropicana-Hotel/pool.jpg" },
      { name: "View", image: "/images/Tropicana-Hotel/view.jpg" },
    ],
    roomPrices: { Single: 70, Twin: 100, Family: 150, Suite: 240 },
    roomCapacity: { Single: 1, Twin: 2, Family: 3, Suite: 2 },
    mealPrices: {
      Breakfast: { adult: 10, child: 5 },
      "Half Board": { adult: 22, child: 11 },
      "Full Board": { adult: 35, child: 18 },
    },
  },
];

async function seedHotels() {
  try {
    await connectToDB();

    let createdCount = 0;
    let skippedCount = 0;

    for (let oneHotel of hotels) {
      const foundHotel = await Hotel.findOne({ name: oneHotel.name });

      if (foundHotel) {
        console.log("Skipped (already exists): " + oneHotel.name);
        skippedCount++;
      } else {
        await Hotel.create(oneHotel);
        console.log("Created: " + oneHotel.name);
        createdCount++;
      }
    }

    console.log(
      "Finished. Created: " + createdCount + ", Skipped: " + skippedCount,
    );
  } catch (error) {
    console.log("Error Occured", error);
  }
}

seedHotels();
