const express = require("express");
const { Mongoose } = require("mongoose");
const router = express.Router();
const Products = require("../models/products");
const { isAuthorized, isSeller } = require("../configs/auth");
const fs = require("fs");
const nodeJSPath = require("path");
const { response } = require("express");

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
  Products.findById(request.params.id, (err, product) => {
    if (err) throw err;
    response.render("details.ejs", { product });
    console.log("voici le produit", product);
  });
});

// Router to post product into the DB
// To add Multer to keep p.roundedicutres in MongoDB add isAuthorized, isSeller after testing
router.post("/products", (request, response) => {
  const { originalname, destination, filename, size, path, mimetype } =
    request.files[0];
  const MAXFILESIZE = 2 * 1024 * 1024; //2mb = 2 * 1024mb * 1024 kilobytes
  //Image permise
  const mimetypePermis = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/ico",
    "image/webp",
  ];
  const { productName, type, price, desc } = request.body;
  let errors = [];
  if (size > MAXFILESIZE) {
    erreurs.push({ msg: "Image size exceeded" });
  } else {
    if (!mimetypePermis.includes(mimetype)) {
      erreurs.push({ msg: "Filetype not allowed" });
    }
  }
  if (!productName || !type || !price || !desc) {
    erreurs.push({ msg: "Fill the form completely" });
  }
  if (errors.length > 0) {
    deletePicture(path);
    response.render("produtcs", {
      productName,
      type,
      price,
      desc,
    });
  } else {
    let id = `${Math.random() * 10}${Math.random() * 100}${Math.random() * 50}`;
    let newProduct = {
      _id: id,
      productName: productName,
      type: type,
      price: price,
      desc: desc,
      owner: "TestingPhasePlaceholder",
      productPicture: keepPicture(path, filename),
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
  }
});

// Router for add Products page
router.get("/products", (requete, reponse) => reponse.render("products"));

/**
 * @param {string} path le nom du fichier a supprimer
 * Cette function supprime un fichier utilisant la librairy fs
 */
function deletePicture(path) {
  let nameFile = nodeJSPath.join(__dirname, "..", path);
  fs.unlink(nameFile, (err) => {
    if (err) console.log(err);
    console.log("file deleted: ", nameFile);
  });
}

/**
 * @param {string} path le nom du path du fichier a supprimer
 * @param {string} filename le nom du fichier dans multer
 * cette function deplace le fichier a conserver dans un dossier images
 */
function keepPicture(path, fileName) {
  let oldName = nodeJSPath.join(__dirname, "..", path);
  let newName = nodeJSPath.join(
    __dirname,
    "..",
    "static",
    "pictures",
    fileName
  );
  fs.rename(oldName, newName, (err) => {
    if (err) console.log(err);
    console.log("Fichier renommer: ", oldName, " a :", newName);
  });
  return fileName;
}

module.exports = router;
