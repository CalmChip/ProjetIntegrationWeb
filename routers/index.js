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
    console.log("voici la liste de produits", allProducts)
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

/**page details produit 
router.get("/details", (request, response) => {
  Products.findById({}, (err,products) => {
    if (err) throw err;
    response.render("productDetails", {
    });
    console.log("voici le produit", products)
  });
});
*/

// Router to post product into the DB
// To add Multer to keep picutres in MongoDB
router.post("/products",isAuthorized, isSeller, (request, response) => {
  const { productName, type, price, desc, productPicture } = request.body;
  let newProduct = {
    _id: new Mongoose.ObjectId(),
    productName: productName,
    type: type,
    price: price,
    desc: desc,
    productPicture: productPicture, 
  };
  newProduct.save().then((products) => {
    request.flash("success_msg", "Product added successfully");
    response.redirect("accueil").catch((err) => {
      console.log(err);
    });
  });
});


router.get('/products', (requete, reponse) => reponse.render('products'));
module.exports = router;

