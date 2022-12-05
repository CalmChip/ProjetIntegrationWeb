const express = require("express");
const router = express.Router();
const Products = require("../models/products");

//Routers for main web page rendering
router.get("/", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      allProducts: allProducts,
    });
  });
});
router.get("/accueil", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      allProducts: allProducts,
    });
  });
});
router.get("/index", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      allProducts: allProducts,
    });
  });
});
router.get("/index.html", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      allProducts: allProducts,
    });
  });
});

/* // Router to post product into the DB
router.post("/products", (request, response) => {

}); */

module.exports = router;
