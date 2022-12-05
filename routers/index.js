const express = require("express");
const router = express.Router();
const Products = require("../models/products");

//Routers for main web page rendering
router.get("/", (requete, reponse) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    reponse.render("accueil", {
      allProducts: allProducts,
    });
  });
});
router.get("/index", (requete, reponse) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    reponse.render("accueil", {
      allProducts: allProducts,
    });
  });
});
router.get("/index.html", (requete, reponse) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    reponse.render("accueil", {
      allProducts: allProducts,
    });
  });
});

module.exports = router;
