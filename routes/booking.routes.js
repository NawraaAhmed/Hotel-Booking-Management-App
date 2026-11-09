const router = require("express").Router();
const Booking = require("../models/Booking.js");
const Hotel = require("../models/Hotel.js");
const Review = require("../models/Review.js");
const {
  getToday,
  countNights,
  getBookingData,
  validateBooking,
  calculatePrice,
} = require("../utils/booking.js");

const usedPaymentIds = new Set();

router.get("/payment", async (req, res) => {
  const pendingBooking = req.session.pendingBooking;
  if (!pendingBooking) {
    return res.redirect("/bookings");
  }

  const hotel = await Hotel.findById(pendingBooking.hotel);
  if (!hotel) {
    delete req.session.pendingBooking;
    return res.send("Hotel not found.");
  }

  // validate again
  const error = validateBooking(hotel, pendingBooking);
  const price = error ? null : calculatePrice(hotel, pendingBooking);

  res.render("bookings/payment.ejs", {
    hotel,
    booking: pendingBooking,
    price,
    error,
  });
});

router.post("/payment", async (req, res) => {
  const pendingBooking = req.session.pendingBooking;

  // no pending booking means it was already paid
  if (!pendingBooking) {
    return res.redirect("/bookings");
  }

  // stop duplicate submits
  const paymentId = pendingBooking.paymentId;
  if (!paymentId || usedPaymentIds.has(paymentId)) {
    return res.redirect("/bookings");
  }
  usedPaymentIds.add(paymentId);

  const hotel = await Hotel.findById(pendingBooking.hotel);
  if (!hotel) {
    delete req.session.pendingBooking;
    return res.send("Hotel not found.");
  }

  const error = validateBooking(hotel, pendingBooking);
  if (error) {
    usedPaymentIds.delete(paymentId); // nothing was booked, retry
    return res.redirect("/bookings/payment");
  }

  const price = calculatePrice(hotel, pendingBooking);

  // clear the pending booking
  delete req.session.pendingBooking;

  await Booking.create({
    checkIn: pendingBooking.checkIn,
    checkOut: pendingBooking.checkOut,
    adults: pendingBooking.adults,
    children: pendingBooking.children,
    rooms: pendingBooking.rooms,
    roomType: pendingBooking.roomType,
    bedType: pendingBooking.bedType,
    viewType: pendingBooking.viewType,
    mealPlan: pendingBooking.mealPlan,
    totalPrice: price.totalPrice,
    hotel: hotel._id,
    user: req.session.user._id,
  });

  req.session.message =
    "Payment successful! Your booking at " + hotel.name + " is confirmed.";
  res.redirect("/");
});

// READ all booking
router.get("/", async (req, res) => {
  const bookings = await Booking.find({ user: req.session.user._id })
    .populate("hotel")
    .sort({ checkIn: 1 });

  const message = req.session.message;
  delete req.session.message;

  res.render("bookings/index.ejs", { bookings, today: getToday(), message });
});

// READ one booking
router.get("/:bookingId", async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.session.user._id,
  }).populate("hotel");
  if (!booking) {
    return res.send("Booking not found.");
  }

  const review = await Review.findOne({ booking: booking._id });
  const today = getToday();

  res.render("bookings/show.ejs", {
    booking,
    review,
    nights: countNights(booking.checkIn, booking.checkOut),
    canChange: booking.checkIn > today, // edit/cancel only before check-in
    canReview: booking.checkOut < today, // review only after check-out
  });
});

// EDIT
router.get("/:bookingId/edit", async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.session.user._id,
  }).populate("hotel");
  if (!booking) {
    return res.send("Booking not found.");
  }
  if (booking.checkIn <= getToday()) {
    return res.send(
      "This booking can no longer be edited (check-in date has arrived).",
    );
  }

  res.render("bookings/edit.ejs", {
    booking,
    hotel: booking.hotel,
    formData: booking,
    error: null,
    today: getToday(),
  });
});

// UPDATE
router.put("/:bookingId", async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.session.user._id,
  }).populate("hotel");
  if (!booking) {
    return res.send("Booking not found.");
  }
  if (booking.checkIn <= getToday()) {
    return res.send(
      "This booking can no longer be edited (check-in date has arrived).",
    );
  }

  const hotel = booking.hotel;
  const bookingData = getBookingData(req.body);
  const error = validateBooking(hotel, bookingData);
  if (error) {
    return res.render("bookings/edit.ejs", {
      booking,
      hotel,
      formData: req.body,
      error,
      today: getToday(),
    });
  }

  // recalculate the price
  const price = calculatePrice(hotel, bookingData);
  await Booking.findOneAndUpdate(
    { _id: booking._id, user: req.session.user._id },
    { ...bookingData, totalPrice: price.totalPrice },
    { runValidators: true },
  );

  res.redirect("/bookings/" + booking._id);
});

// DELETE (cancel)
router.delete("/:bookingId", async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.session.user._id,
  });
  if (!booking) {
    return res.send("Booking not found.");
  }
  if (booking.checkIn <= getToday()) {
    return res.send(
      "This booking can no longer be cancelled (check-in date has arrived).",
    );
  }

  await Booking.findOneAndDelete({
    _id: booking._id,
    user: req.session.user._id,
  });
  req.session.message = "Your booking has been cancelled.";
  res.redirect("/bookings");
});

module.exports = router;
