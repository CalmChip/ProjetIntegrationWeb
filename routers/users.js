const express = require("express");
const passport = require("passport");
const router = express.Router();
const { isAuthorized, isSeller } = require("../configs/auth");
const Products = require("../models/products");
const Users = require("../models/usagers");
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
  const { _id, name, email, password, password2, roleAdmin, roleSeller } = requete.body; //pour aller les cherchers
  let erreurs = [];
  console.log("I was here");
  if (!name || !email || !password || !password2) {
    erreurs.push({ msg: "Remplir tout les champs" });
  }
  if (password.length < 4) {
    erreurs.push({ msg: "Le mot de pass doit etre 4 car minimum" });
  }
  if (password !== password2) {
    erreurs.push({ msg: "Les mots de passe doivent être identique" });
  }
  if (erreurs.length > 0) {
    reponse.render("register", {
      erreurs,
      _id,
      name,
      email,
      password,
      password2,
      roleAdmin,
      roleSeller,
    });
  } else {
    //yes on met dans la BD
    Users.findById(_id).then((user) => {
      //traitement des courriels deja existant
      if (user) {
        erreurs.push({ msg: "Ce courriel existe deja" });
        reponse.render("register", {
          erreurs,
          name,
          _id,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new Users({ name, email, _id, password });
        //ici on va Hacer mais on peut aussi chiffré
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hache) => {
            newUser.password = hache;
            let tabRoles = ['user']
            if (roleAdmin)
              tabRoles.push('admin')
            if (roleSeller)
              tabRoles.push('seller')
            //save dans les roles
            newUser.roles = tabRoles
            newUser.save() //ecrire dans la BD
              .then((user) => {
                requete.flash(
                  "success_msg",
                  "Usager ajouté... Vous pouvez vous connecter"
                );
                reponse.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

module.exports = router;
