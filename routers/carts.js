const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", (request, response) => {
  response.render("cartPage");
});

module.exports = router;
