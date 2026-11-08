const ROOM_TYPES = ["Single", "Twin", "Family", "Suite"];
const BED_TYPES = ["King", "Queen", "Twin"];
const VIEW_TYPES = ["Sea", "City", "Garden"];
const MEAL_PLANS = ["Breakfast", "Half Board", "Full Board"];

// returns today date as YYYY-MM-DD
function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// counts the nights between two "YYYY-MM-DD" dates
function countNights(checkIn, checkOut) {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(checkOut) - new Date(checkIn)) / oneDay);
}

// checks that a string is a real date in the "YYYY-MM-DD" format
function isValidDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date) && date.toISOString().slice(0, 10) === dateString;
}

function getBookingData(body) {
  return {
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    adults: Number(body.adults),
    children: Number(body.children),
    rooms: Number(body.rooms),
    roomType: body.roomType,
    bedType: body.bedType,
    viewType: body.viewType,
    mealPlan: body.mealPlan,
  };
}

// returns messages
function validateBooking(hotel, data) {
  if (!isValidDate(data.checkIn) || !isValidDate(data.checkOut)) {
    return "Please choose valid check-in and check-out dates.";
  }
  if (data.checkIn < getToday()) {
    return "Check-in date cannot be in the past.";
  }
  if (countNights(data.checkIn, data.checkOut) < 1) {
    return "Check-out must be at least one day after check-in.";
  }
  if (!Number.isInteger(data.adults) || data.adults < 1 || data.adults > 4) {
    return "Adults must be between 1 and 4.";
  }
  if (
    !Number.isInteger(data.children) ||
    data.children < 0 ||
    data.children > 4
  ) {
    return "Children must be between 0 and 4.";
  }
  if (!Number.isInteger(data.rooms) || data.rooms < 1 || data.rooms > 3) {
    return "Rooms must be between 1 and 3.";
  }
  if (!ROOM_TYPES.includes(data.roomType)) {
    return "Please choose a valid room type.";
  }
  if (!BED_TYPES.includes(data.bedType)) {
    return "Please choose a valid bed type.";
  }
  if (!VIEW_TYPES.includes(data.viewType)) {
    return "Please choose a valid view type.";
  }
  if (!MEAL_PLANS.includes(data.mealPlan)) {
    return "Please choose a valid meal plan.";
  }

  // children count toward room capacity
  const guests = data.adults + data.children;
  const capacityPerRoom = hotel.roomCapacity[data.roomType];
  const totalCapacity = capacityPerRoom * data.rooms;
  if (guests > totalCapacity) {
    return (
      "A " +
      data.roomType +
      " room at this hotel fits " +
      capacityPerRoom +
      " guest(s). " +
      data.rooms +
      " room(s) fit up to " +
      totalCapacity +
      " guest(s), but you selected " +
      guests +
      " guest(s)."
    );
  }

  return null;
}

function calculatePrice(hotel, data) {
  const nights = countNights(data.checkIn, data.checkOut);

  const roomPrice = hotel.roomPrices[data.roomType];
  const adultMealPrice = hotel.mealPrices[data.mealPlan].adult;
  const childMealPrice = hotel.mealPrices[data.mealPlan].child;

  // Room cost = room price x rooms x nights
  const roomCost = roomPrice * data.rooms * nights;

  // Meal cost = (adult price x adults x nights) + (child price x children x nights)
  const adultMealCost = adultMealPrice * data.adults * nights;
  const childMealCost = childMealPrice * data.children * nights;
  const mealCost = adultMealCost + childMealCost;

  return {
    nights,
    roomPrice,
    adultMealPrice,
    childMealPrice,
    roomCost,
    adultMealCost,
    childMealCost,
    mealCost,
    totalPrice: roomCost + mealCost,
  };
}

module.exports = {
  ROOM_TYPES,
  BED_TYPES,
  VIEW_TYPES,
  MEAL_PLANS,
  getToday,
  countNights,
  getBookingData,
  validateBooking,
  calculatePrice,
};
