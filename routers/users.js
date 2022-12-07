const express = require("express");
const passport = require("passport");
const router = express.Router();
const { isAuthorized, isSeller } = require("../configs/auth");
const Products = require("../models/products");
const Usagers = require("../models/usagers");
const bcrypt = require("bcryptjs");

// Router that renders login page
router.get("/login", (request, response) => {
  response.render("login");
});

// Router for login out
router.get("/logout", (requete, reponse) => {
  requete.logout((err) => {
    if (err) throw err;
    requete.flash("success_msg", "Déconnection réeussis.");
    reponse.redirect("login");
  });
});

// router that autenticate users upon request to login
router.post("/login", (requete, reponse, next) => {
  passport.authenticate("local", {
    successRedirect: "accueil",
    badRequestMessage: "Remplir tous les champs",
    failureRedirect: "login",
    failureFlash: true,
  })(requete, reponse, next);
});

// Router that gets a product by its ID and renders its info on the page
router.get("/modify/:id", isAuthorized, isSeller, (request, response) => {
  Products.getProductByID(request.params._id, (err, product) => {
    if (err) throw err;
    response.render("PageModifierProduitIci", {
      productInfo: product,
    });
  });
});

// Router that renders login page
router.get("/register", (requete, response) => {
  response.render("register");
});

router.post("/register", (requete, reponse) => {
  const { nom, _id, password, roleGestion, roleAdmin } = requete.body;
  /*   const { originalname, destination, filename, size, path, mimetype } =
    requete.files[0]; */
  /*  const MAXFILESIZE = 2 * 1024 * 1024; //2mb = 2 * 1024mb * 1024 kilobytes */
  //Image permise
  /*   const mimetypePermis = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/ico",
    "image/webp",
  ]; */

  let erreurs = [];
  /*   if (size > MAXFILESIZE) {
    erreurs.push({ msg: "Image size exceeded" });
  } else {
    if (!mimetypePermis.includes(mimetype)) {
      erreurs.push({ msg: "Filetype not allowed" });
    }
  } */
  if (!nom || !_id || !password) {
    erreurs.push({ msg: "Remplir tous les champs" });
  }
  console.log(password);
  if (password.length < 4) {
    erreurs.push({ msg: "Le mots de passe doit etre de 4 car. minimum" });
  }
  if (erreurs.length > 0) {
    //supprimerFichier(path);
    reponse.render("register", {
      erreurs,
      nom,
      _id,
      password,
      roleAdmin,
      roleGestion,
    });
  } else {
    Usagers.findById(_id).then((usager) => {
      if (usager) {
        //supprimerFichier(path);
        erreurs.push({ msg: "Ce courriel existe deja" });
        reponse.render("register", {
          erreurs,
          nom,
          _id,
          password,
          roleAdmin,
          roleGestion,
        });
      } else {
        const nouveauUsager = new Usagers({ nom, _id, password });
        // ici on hache le mot de passe
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hache) => {
            nouveauUsager.password = hache;
            /* nouveauUsager.fichierImage = conserverFichier(path, filename); */
            let tabRoles = ["normal"];
            if (roleAdmin) {
              tabRoles.push("admin");
            }
            if (roleGestion) {
              tabRoles.push("gestion");
            }
            nouveauUsager.roles = tabRoles;
            nouveauUsager
              .save()
              .then((user) => {
                requete.flash("succes_msg", "Usager ajouté...");
                reponse.redirect("/");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

module.exports = router;
