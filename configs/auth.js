module.exports = {
  isAuthorized: function (requete, reponse, next) {
    if (requete.isAuthenticated()) {
      return next();
    } else {
      requete.flash(
        "erreur_msg",
        "Authentification requise pour consulter cette page..."
      );
      reponse.redirect("/");
    }
  },
  isAdmin: function (requete, reponse, next) {
    if (requete.isAuthenticated()) {
      const rolesUser = requete.user.roles;
      const admin = rolesUser.find((role) => role == "admin");
      if (admin) {
        return next();
      } else {
        requete.flash(
          "erreur_msg",
          "Authentication failed, only admin can access this page"
        );
        reponse.redirect("/");
      }
    } else {
      requete.flash(
        "erreur_msg",
        "Authentification requise pour consulter cette page..."
      );
      reponse.redirect("/");
    }
  },
  isSeller: function (requete, reponse, next) {
    if (requete.isAuthenticated()) {
      const rolesUser = requete.user.roles;
      const gestion = rolesUser.find((role) => role == "seller");
      if (gestion) {
        return next();
      } else {
        requete.flash(
          "erreur_msg",
          "Authentication failed, only sellers can access this page"
        );
        reponse.redirect("/");
      }
    } else {
      requete.flash(
        "erreur_msg",
        "Authentification requise pour consulter cette page..."
      );
      reponse.redirect("/"); // Vers login ou autre
    }
  },
};
