const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//récupérer le modele pour la collection usagers
const Users = require("../models/usagers");

//nécessaire pour le fonctionnement (les 3)

module.exports = function (passport) {
  //passport use
  passport.use(
    //on lui passe sur le id
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //trouver notre utilisateur
      Users.findOne({ email: email }).then((usager) => {
        if (!usager) {
          return done(null, false, { message: "Ce courriel n'existe pas!" });
        }
        bcrypt.compare(password, usager.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, usager);
          } else {
            return done(null, false, { message: "Mot de passe invalide" });
          }
        });
      });
    })
  );
  //passport serialize
  passport.serializeUser(function (usager, done) {
    done(null, usager._id);
  });
  //passport deserialize
  passport.deserializeUser(function (email, done) {
    Users.findById(email, function (err, usager) {
      done(err, usager);
    });
  });
};
