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
      products: allProducts,
    });
    console.log("voici la liste de produits", allProducts);
  });
});
router.get("/accueil", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      products: allProducts,
    });
  });
});
router.get("/index", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      products: allProducts,
    });
  });
});
router.get("/index.html", (request, response) => {
  Products.find({}, (err, allProducts) => {
    if (err) throw err;
    response.render("accueil", {
      products: allProducts,
    });
  });
});

// page details produit
router.get("/details/:id", (request, response) => {
  Products.findById(request.params.id, (err, products) => {
    if (err) throw err;
    response.render("productDetails", { products });
    console.log("voici le produit", products);
  });
});

// Router to post product into the DB
// To add Multer to keep p.roundedicutres in MongoDB add isAuthorized, isSeller after testing
router.post("/products", (request, response) => {
  const { productName, type, price, desc } = request.body;
  let id = `${Math.random() * 10}${Math.random() * 100}${Math.random() * 50}`;
  let newProduct = {
    _id: id,
    productName: productName,
    type: type,
    price: price,
    desc: desc,
    // productPicture: productPicture,
  };
  Products.createProduct(newProduct, (err, product) => {
    if (err) throw err;
    Products.find({}, (err2, allProducts) => {
      if (err2) throw err2;
      response.render("accueil", {
        products: allProducts,
      });
    });
  });
});

// Router for add Products page
router.get("/products", (requete, reponse) => reponse.render("products"));

module.exports = router;
