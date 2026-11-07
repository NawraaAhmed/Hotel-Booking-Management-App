const router = require("express").Router();
const Hotel = require("../models/Hotel.js");

router.get("/", async (req, res) => {
  const topHotels = await Hotel.find({ rating: 5 }).limit(3);

  const message = req.session.message;
  delete req.session.message;

  res.render("homepage.ejs", { topHotels, message });
});

module.exports = router;
