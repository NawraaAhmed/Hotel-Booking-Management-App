const router = require("express").Router();
const crypto = require("crypto"); // for unique payment id
const Hotel = require("../models/Hotel.js");
const Review = require("../models/Review.js");
const isSignedIn = require("../middleware/is-signed-in.js");
const {
  getToday,
  getBookingData,
  validateBooking,
} = require("../utils/booking.js");

router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  res.render("hotels/homepage.ejs", { hotels });
});

router.get("/favorites", isSignedIn, async (req, res) => {
  const hotels = await Hotel.find({ favoriteByUsers: req.session.user._id });
  res.render("hotels/favorites.ejs", { hotels });
});

router.get("/:hotelId", async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    return res.send("Hotel not found.");
  }

  // if visitor already started booking for this hotel: refill the form
  let formData = {};
  const pendingBooking = req.session.pendingBooking;
  if (pendingBooking && pendingBooking.hotel === hotel.id) {
    formData = pendingBooking;
  }

  res.render("hotels/show-hotel.ejs", {
    hotel,
    formData,
    error: null,
    today: getToday(),
  });
});

// validate, save choices in the session, then go to payment
router.post("/:hotelId/book", async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    return res.send("Hotel not found.");
  }

  const bookingData = getBookingData(req.body);
  const error = validateBooking(hotel, bookingData);
  if (error) {
    return res.render("hotels/show-hotel.ejs", {
      hotel,
      formData: req.body,
      error,
      today: getToday(),
    });
  }

  bookingData.hotel = hotel.id;
  // one time id so the same pending booking can only be paid once
  bookingData.paymentId = crypto.randomUUID();
  req.session.pendingBooking = bookingData;

  if (!req.session.user) {
    return res.redirect("/auth/sign-in");
  }

  res.redirect("/bookings/payment");
});

router.get("/:hotelId/reviews", async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    return res.send("Hotel not found.");
  }

  const reviews = await Review.find({ hotel: hotel._id })
    .populate("user", "username")
    .sort({ createdAt: -1 });

  const message = req.session.message;
  delete req.session.message;

  res.render("hotels/reviews.ejs", { hotel, reviews, message });
});

// after favorite/unfavorite: go back to the page the heart was clicked on
// (only these pages are allowed, otherwise go to the hotel details page)
function getReturnPath(returnTo, hotelId) {
  const allowedPaths = ["/", "/hotels", "/hotels/favorites"];
  if (allowedPaths.includes(returnTo)) {
    return returnTo;
  }
  return "/hotels/" + hotelId;
}

// FAVORITE (signed in only, a user can only add/remove themselves)
router.post("/:hotelId/favorite", isSignedIn, async (req, res) => {
  // $addToSet only adds the user if they are not already in the list
  const hotel = await Hotel.findByIdAndUpdate(req.params.hotelId, {
    $addToSet: { favoriteByUsers: req.session.user._id },
  });
  if (!hotel) {
    return res.send("Hotel not found.");
  }
  res.redirect(getReturnPath(req.body.returnTo, hotel._id));
});

router.post("/:hotelId/unfavorite", isSignedIn, async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.hotelId, {
    $pull: { favoriteByUsers: req.session.user._id },
  });
  if (!hotel) {
    return res.send("Hotel not found.");
  }
  res.redirect(getReturnPath(req.body.returnTo, hotel._id));
});

module.exports = router;
