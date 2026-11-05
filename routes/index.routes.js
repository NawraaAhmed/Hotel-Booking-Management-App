const router = require("express").Router();
const Hotel = require("../models/Hotel.js");

router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  res.render("homepage.ejs", { hotels });
});

module.exports = router;
