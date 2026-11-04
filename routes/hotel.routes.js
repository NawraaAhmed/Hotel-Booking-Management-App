const router = require("express").Router();
const Hotel = require("../models/Hotel.js");

router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  res.render("hotels/index.ejs", { hotels });
});

router.get("/:hotelId", async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  res.render("hotels/show.ejs", { hotel });
});

module.exports = router;
