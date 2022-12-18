const express = require("express");
const passport = require("passport");
const router = express.Router();
const { isAuthorized, isSeller } = require("../configs/auth");
const Users = require("../models/usagers");
const bcrypt = require("bcryptjs");
const Products = require("../models/products");

// Router that renders login page
router.get("/login", (request, response) => {
  response.render("login");
});

// Router for login out
router.get("/logout", (request, response) => {
  request.logout((err) => {
    if (err) throw err;
    request.flash("success_msg", "Déconnection réeussis.");
    response.redirect("/users/login");
  });
});

// router that autenticate users upon request to login
router.post("/login", (request, response, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    badRequestMessage: "Remplir tous les champs",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(request, response, next);
});

// Router Page de profile Usager
router.get("/profile", isAuthorized, (request, response) => {
  console.log(request.user)
  response.render("profile", {
    user: request.user
  });
});


// Router that gets a product by its ID and renders its info on the page
router.get("/modify/:_id", (request, response) => {
  Users.getUserById(request.params._id, (err, userInfo) => {
    if (err) throw err;
    response.render("modifyUser", {
      user: userInfo,
    });
  });
});

// Router that modifyUser
router.post("/modify/:_id", (request, response) => {
  const { _id, name, email, password, password2, roleAdmin, roleSeller } =
    request.body;
  let newUser = {
    _id: _id,
    name: name,
    email: email,
    password: password,
    roles: [],
  };
  let rolesTab = ["user"];
  let errors = [];
  if (roleAdmin) {
    rolesTab.push("admin");
  }
  if (roleSeller) {
    rolesTab.push("seller");
  }
  newUser.roles = rolesTab;
  if (password.length < 4) {
    errors.push({ msg: "Le mot de pass doit etre 4 car minimum" });
  }
  if (password !== password2) {
    errors.push({ msg: "Les mots de passe doivent être identique" });
  }
  if (errors.length > 0) {
    response.render("modifyUser", {
      errors,
      _id,
      name,
      email,
      password,
      password2,
      roleAdmin,
      roleSeller,
    });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;
        Users.modifyUser(request.params._id, newUser, (err, msg) => {
          if (err) throw err;
          request.flash(
            "succes_msg",
            "Usager modifier avec succes. Connectez vous pour continuer."
          );
          response.redirect("/users/login");
        });
      });
    });
  }
});

// Router that renders login page
router.get("/register", (request, response) => {
  response.render("register");
});

router.get("/checkout", (req, res) => {
  res.render("checkout");
});
router.post("/checkout", (req, res) => {
  res.render("checkout");
});

router.post("/register", (request, response) => {
  const { _id, name, email, password, password2, roleAdmin, roleSeller } =
    request.body; //pour aller les cherchers
  let erreurs = [];
  if (!name || !email || !password || !password2) {
    erreurs.push({ msg: "Remplir tout les champs" });
  }
  if (password.length < 4) {
    erreurs.push({ msg: "Le mot de pass doit etre 4 car minimum" });
  }
  if (password !== password2) {
    erreurs.push({ msg: "Les mots de passe doivent être identique" });
  }
  Users.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    console.log(user);
    if (email === user.email) {
      erreurs.push({ msg: "Courriel invalide" });
    }
    if (erreurs.length > 0) {
      response.render("register", {
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
      const newUser = new Users({ name, email, _id, password });
      //ici on va Hacer mais on peut aussi chiffré
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hache) => {
          newUser.password = hache;
          let tabRoles = ["user"];
          if (roleAdmin) tabRoles.push("admin");
          if (roleSeller) tabRoles.push("seller");
          //save dans les roles
          newUser.roles = tabRoles;
          newUser
            .save() //ecrire dans la BD
            .then((user) => {
              request.flash(
                "success_msg",
                "Usager ajouté... Vous pouvez vous connecter"
              );
              response.redirect("/users/login");
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.get("/admin", (request, response) => {
  Users.find({}, (err, users) => {
    if (err) throw err;
    let userToVerify = [];
    users.forEach((user) => {
      if (user.verified === false) {
        userToVerify.push(user);
      }
    });
    response.render("admin", {
      allUsers: userToVerify,
    });
    console.log("Admin:", userToVerify);
  });
});

router.post("/admin/:id", (request, response) => {
  Users.verifyUsers(request.params.id, (err, users) => {
    if (err) throw err;
    Users.find({}, (err, users) => {
      if (err) throw err;
      let userToVerify = [];
      users.forEach((user) => {
        if (user.verified === false) {
          userToVerify.push(user);
        }
      });
      response.render("admin", {
        allUsers: userToVerify,
      });
      console.log(userToVerify);
    });
  });
});

router.get("/profile", (request, response) => {
  const _id = request.user._id;
  Users.findById(_id, (err, user) => {
    if (err) throw err;
    Products.findProductByOwner(_id, (err, product) => {
      if (err) throw err;
      response.render("profile", {
        userInfo: user,
        productInfo: product,
      });
    });
  });
});

router.get("/chatSeller", isAuthorized, (request, response) => {
  response.render("chatSeller", {
    user: request.user
  });
});

module.exports = router;
