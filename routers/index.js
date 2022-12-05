const express = require("express");
const { Mongoose } = require("mongoose");
const router = express.Router();
const Products = require("../models/products");
const { isAuthorized, isSeller } = require("../configs/auth");

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

// Router to post product into the DB
router.post("/products", isAuthorized, isSeller, (request, response) => {
  const { productName, type, price, desc } = request.body;
  let newProduct = {
    _id: new Mongoose.ObjectId(),
    productName: productName,
    type: type,
    price: price,
    desc: desc,
  };
  newProduct.save().then((product) => {
    request.flash("succes_msg", "Product added successfully");
    response.redirect("accueil").catch((err) => {
      console.log(err);
    });
  });
});

module.exports = router;
