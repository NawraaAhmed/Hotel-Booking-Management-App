const router = require("express").Router();
const Review = require("../models/Review.js");
const Booking = require("../models/Booking.js");
const { getToday } = require("../utils/booking.js");

// returns an error message
function validateReview(rating, comment) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be a whole number from 1 to 5.";
  }
  if (!comment) {
    return "Please write a comment.";
  }
  return null;
}

// find booking that can be reviewed
async function findReviewableBooking(bookingId, userId) {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate("hotel");
  if (!booking) {
    return { error: "Booking not found." };
  }
  if (booking.checkOut >= getToday()) {
    return {
      error:
        "You can only review a hotel after your check-out date has passed.",
    };
  }
  const existingReview = await Review.findOne({ booking: booking._id });
  if (existingReview) {
    return { error: "You have already reviewed this booking." };
  }
  return { booking };
}

// CREATE
router.get("/new/:bookingId", async (req, res) => {
  const result = await findReviewableBooking(
    req.params.bookingId,
    req.session.user._id,
  );
  if (result.error) {
    return res.send(result.error);
  }
  res.render("reviews/new.ejs", {
    booking: result.booking,
    formData: {},
    error: null,
  });
});

router.post("/", async (req, res) => {
  const result = await findReviewableBooking(
    req.body.bookingId,
    req.session.user._id,
  );
  if (result.error) {
    return res.send(result.error);
  }
  const booking = result.booking;

  const rating = Number(req.body.rating);
  const comment = (req.body.comment || "").trim();
  const error = validateReview(rating, comment);
  if (error) {
    return res.render("reviews/new.ejs", {
      booking,
      formData: req.body,
      error,
    });
  }

  await Review.create({
    rating,
    comment,
    user: req.session.user._id,
    hotel: booking.hotel._id,
    booking: booking._id,
  });

  res.redirect("/hotels/" + booking.hotel._id + "/reviews");
});

// EDIT (only the owner)
router.get("/:reviewId/edit", async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    user: req.session.user._id,
  }).populate("hotel");
  if (!review) {
    return res.send("Review not found.");
  }
  res.render("reviews/edit.ejs", { review, formData: review, error: null });
});

// UPDATE (only the owner)
router.put("/:reviewId", async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    user: req.session.user._id,
  }).populate("hotel");
  if (!review) {
    return res.send("Review not found.");
  }

  const rating = Number(req.body.rating);
  const comment = (req.body.comment || "").trim();
  const error = validateReview(rating, comment);
  if (error) {
    return res.render("reviews/edit.ejs", {
      review,
      formData: req.body,
      error,
    });
  }

  await Review.findOneAndUpdate(
    { _id: review._id, user: req.session.user._id },
    { rating, comment },
    { runValidators: true },
  );

  res.redirect("/hotels/" + review.hotel._id + "/reviews");
});

// DELETE (only the owner)
router.delete("/:reviewId", async (req, res) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.reviewId,
    user: req.session.user._id,
  });
  if (!review) {
    return res.send("Review not found.");
  }
  res.redirect("/hotels/" + review.hotel + "/reviews");
});

module.exports = router;
