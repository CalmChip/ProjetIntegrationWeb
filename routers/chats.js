const express = require("express");
const Chats = require("../models/chats");
const Products = require("../models/products");
const { isAuthorized } = require("../configs/auth");
const router = express.Router();

router.route("/:idSeller/:idUser").get(isAuthorized, (request, res) => {
  Products.findById(request.params.idSeller, (err, product) => {
    if (err) throw err;
    let data = Chats.find({ message: "Seller" });
    Chats.find({}).then((chat) => {
      res.render("chatSeller", {
        chat: chat,
        user: request.user,
        product: product,
      });
    });
  });
});

module.exports = router;
